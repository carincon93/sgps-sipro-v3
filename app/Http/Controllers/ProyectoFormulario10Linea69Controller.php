<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario10Linea69Request;
use App\Http\Requests\ProyectoFormulario10Linea69ColumnRequest;
use App\Http\Requests\ProyectoFormulario10Linea69Request;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario10Linea69;
use App\Models\LineaProgramatica;
use App\Models\NodoTecnoparque;
use App\Models\ProyectoFormulario10Linea69;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProyectoFormulario10Linea69Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario10Linea69/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_10_linea_69'  => ProyectoFormulario10Linea69::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $centros_formacion = SelectHelper::centrosFormacion();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario10Linea69/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'hubs_innovacion'       => SelectHelper::hubsInnovacion(),
            'centros_formacion'     => $centros_formacion,
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario10Linea69Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = false;
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(10);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        $proyecto->proyectoFormulario10Linea69()->create([
            'hub_innovacion_id'     => $request->hub_innovacion_id,
            'max_meses_ejecucion'   => $request->max_meses_ejecucion,
            'fecha_inicio'          => $request->fecha_inicio,
            'fecha_finalizacion'    => $request->fecha_finalizacion,
            'proyecto_base'         => false
        ]);

        return redirect()->route('convocatorias.proyectos-formulario-10-linea-69.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_10_linea_69->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_10_linea_69->proyecto]);

        if ($proyecto_formulario_10_linea_69->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_10_linea_69->proyecto->tipo_formulario_convocatoria_id);
        }

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyecto_formulario_10_linea_69->load('proyecto.evaluaciones.evaluacionesProyectoFormulario10Linea69', 'proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');

        $proyecto_formulario_10_linea_69->proyecto->precio_proyecto      = $proyecto_formulario_10_linea_69->proyecto->precioProyecto;
        $proyecto_formulario_10_linea_69->proyecto->centroFormacion;
        $proyecto_formulario_10_linea_69->proyecto->participantes;
        $proyecto_formulario_10_linea_69->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_10_linea_69->proyecto->tipoFormularioConvocatoria->tiposFormularioConvocatoria;

        $proyecto_formulario_10_linea_69->mostrar_recomendaciones        = $proyecto_formulario_10_linea_69->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_10_linea_69->mostrar_requiere_subsanacion   = $proyecto_formulario_10_linea_69->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario10Linea69/Edit', [
            'convocatoria'                      => $convocatoria,
            'proyecto_formulario_10_linea_69'   => $proyecto_formulario_10_linea_69,
            'centros_formacion'                 => SelectHelper::centrosFormacion(),
            'evaluacion'                        => $items_evaluacion ?? [],
            'regionales'                        => SelectHelper::regionales(),
            'nodos_tecnoparque'                 => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $proyecto_formulario_10_linea_69->proyecto->centroFormacion->id)->values()->all(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'hubs_innovacion'                   => SelectHelper::hubsInnovacion(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario10Linea69Request $request, Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_10_linea_69->proyecto]);

        $proyecto_formulario_10_linea_69->resumen                                         = $request->resumen;
        $proyecto_formulario_10_linea_69->fecha_inicio                                    = $request->fecha_inicio;
        $proyecto_formulario_10_linea_69->fecha_finalizacion                              = $request->fecha_finalizacion;
        $proyecto_formulario_10_linea_69->resumen_regional                                = $request->resumen_regional;
        $proyecto_formulario_10_linea_69->antecedentes                                    = $request->antecedentes;
        $proyecto_formulario_10_linea_69->antecedentes_regional                           = $request->antecedentes_regional;
        $proyecto_formulario_10_linea_69->logros_vigencia_anterior                        = $request->logros_vigencia_anterior;
        $proyecto_formulario_10_linea_69->contexto_general                                = $request->contexto_general;
        $proyecto_formulario_10_linea_69->retos_locales_regionales                        = $request->retos_locales_regionales;
        $proyecto_formulario_10_linea_69->estado_actual_departamento                      = $request->estado_actual_departamento;
        $proyecto_formulario_10_linea_69->contribucion_desarrollo_empresas                = $request->contribucion_desarrollo_empresas;
        $proyecto_formulario_10_linea_69->contribucion_agenda_regional_competitividad     = $request->contribucion_agenda_regional_competitividad;
        $proyecto_formulario_10_linea_69->aportes_conpes_4011                             = $request->aportes_conpes_4011;
        $proyecto_formulario_10_linea_69->aportes_conpes_4080                             = $request->aportes_conpes_4080;
        $proyecto_formulario_10_linea_69->situacion_actual_produccion_agricola            = $request->situacion_actual_produccion_agricola;
        $proyecto_formulario_10_linea_69->aportes_alternativas_generacion_electrica       = $request->aportes_alternativas_generacion_electrica;
        $proyecto_formulario_10_linea_69->aportes_impulso_economia_popular                = $request->aportes_impulso_economia_popular;
        $proyecto_formulario_10_linea_69->justificacion_pertinencia                       = $request->justificacion_pertinencia;
        $proyecto_formulario_10_linea_69->acciones_estrategias_campesena                  = $request->acciones_estrategias_campesena;
        $proyecto_formulario_10_linea_69->bibliografia                                    = $request->bibliografia;
        $proyecto_formulario_10_linea_69->hubInnovacion()->associate($request->hub_innovacion_id);
        $proyecto_formulario_10_linea_69->proyecto->centroFormacion()->associate($request->centro_formacion_id);


        $proyecto_formulario_10_linea_69->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69)
    {
        // Proyecto base
        if ($proyecto_formulario_10_linea_69->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_10_linea_69->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_10_linea_69->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario10Linea69Request $request, Convocatoria $convocatoria)
    {
        $evaluacion = Evaluacion::find($request->evaluacion_id);

        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $items_evaluacion_filtrados = [];
        $temp_array = [];

        foreach ($request->all() as $key => $value) {
            // Check if the key starts with "form_"
            if (strpos($key, "form_") === 0) {
                $temp_array[$key] = $value;

                // When tempArray has 4 items, add it to the resultArray and reset tempArray
                if (count($temp_array) === 5) {
                    $items_evaluacion_filtrados[] = $temp_array;
                    $temp_array = [];
                }
            }
        }

        // If there are any remaining items in tempArray, add it to the resultArray
        if (!empty($temp_array)) {
            $items_evaluacion_filtrados[] = $temp_array;
        }

        $evaluacion->update([
            'iniciado'                  => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        foreach ($items_evaluacion_filtrados as $item) {
            $pregunta_id = last($item);

            EvaluacionProyectoFormulario10Linea69::updateOrCreate(
                [
                    'id'            => $item['form_evaluacion_id_pregunta_id_' . $pregunta_id],
                    'pregunta_id'   => $pregunta_id,
                    'evaluacion_id' => $request->evaluacion_id
                ],
                [
                    'comentario'    => $item['form_requiere_comentario_pregunta_id_' . $pregunta_id] ? $item['form_comentario_pregunta_id_' . $pregunta_id] : null,
                    'puntaje'       => $item['form_puntaje_pregunta_id_' . $pregunta_id],
                ],
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $proyecto_formulario_10_linea_69, $proyecto)
    {
        if ($proyecto_formulario_10_linea_69) {
            $clone = $proyecto_formulario_10_linea_69->replicate()->fill([
                'id'                    => $proyecto->id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'max_meses_ejecucion'   => $request->max_meses_ejecucion,
                'hub_innovacion_id'     => $request->hub_innovacion_id,
                'proyecto_base'         => false
            ]);
            $clone->push();

            //re-sync everything hasMany
            $objetivos_especificos = collect([]);
            $nuevas_actividades = collect([]);
            foreach ($proyecto_formulario_10_linea_69->proyecto->causasDirectas as $causa_directa) {
                $nueva_causa_directa = $clone->proyecto->causasDirectas()->create($causa_directa->toArray());
                $nuevo_objetivo_especifico = $nueva_causa_directa->objetivoEspecifico()->create($causa_directa->objetivoEspecifico->toArray());
                $objetivos_especificos->push($nuevo_objetivo_especifico);

                foreach ($causa_directa->causasIndirectas as $causa_indirecta) {
                    $nueva_causa_indirecta = $nueva_causa_directa->causasIndirectas()->create($causa_indirecta->toArray());
                    $nueva_actividad = $nueva_causa_indirecta->actividad()->create([
                        'objetivo_especifico_id'    => $nuevo_objetivo_especifico->id,
                        'resultado_id'              => null,
                        'causa_indirecta_id'        => $nueva_causa_indirecta->id,
                        'fecha_inicio'              => $causa_indirecta->actividad->fecha_inicio,
                        'fecha_finalizacion'        => $causa_indirecta->actividad->fecha_finalizacion,
                        'descripcion'               => $causa_indirecta->actividad->descripcion,
                    ]);


                    $nuevas_actividades->push([
                        'actividad_id'                  => $nueva_actividad->id,
                        'objetivo_especifico_id'        => $nueva_actividad->objetivo_especifico_id,
                        'resultado_antiguo'             => optional($causa_indirecta->actividad->resultado)->descripcion,
                        'objetivo_especifico_antiguo'   => optional($causa_indirecta->actividad->objetivoEspecifico)->numero,
                        'causa_indirecta_id'            => $nueva_actividad->causa_indirecta_id,
                        'descripcion_actividad'         => $nueva_actividad->descripcion
                    ]);
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            $productos = collect([]);
            $nuevos_productos = collect([]);
            foreach ($proyecto_formulario_10_linea_69->proyecto->efectosDirectos as $key => $efecto_directo) {
                $nuevo_efecto_directo = $clone->proyecto->efectosDirectos()->create($efecto_directo->toArray());
                if ($objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()) {
                    $nuevo_resultado = $nuevo_efecto_directo->resultado()->create([
                        'objetivo_especifico_id'    => $objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()->id,
                        'descripcion'               => $efecto_directo->resultado->descripcion,
                    ]);
                    $resultados->push($nuevo_resultado);
                }

                foreach ($efecto_directo->resultado->productos as $producto) {
                    $productos->push($producto->load('actividades'));
                    $nuevo_producto = $nuevo_resultado->productos()->create($producto->toArray());
                    $nuevos_productos->push($nuevo_producto);

                    if ($producto->productoMinciencias()->exists()) {
                        $nuevo_producto->productoMinciencias()->create($producto->productoMinciencias->toArray());
                    }
                }

                foreach ($efecto_directo->efectosIndirectos as $efecto_indirecto) {
                    $nuevo_efecto_indirecto = $nuevo_efecto_directo->efectosIndirectos()->create($efecto_indirecto->toArray());
                    $nuevo_efecto_indirecto->impacto()->create($efecto_indirecto->impacto->toArray());
                }
            }

            foreach ($nuevas_actividades as $key => $actividad) {
                Actividad::where('id', $actividad['actividad_id'])->update([
                    'resultado_id' => $resultados->where('descripcion', $actividad['resultado_antiguo'])->first() ? $resultados->where('descripcion', $actividad['resultado_antiguo'])->first()->id : null
                ]);
            }

            //re-sync everything hasMany
            foreach ($proyecto_formulario_10_linea_69->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            // re-sync productos->actividades
            foreach ($nuevos_productos as $nuevo_producto) {
                if ($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first())) {
                    $nuevo_producto->actividades()->sync($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first()->actividades->pluck('descripcion')->toArray())->pluck('actividad_id')->toArray());
                }
            }

            //re-sync everything belongsToMany
            $clone->proyecto->semillerosInvestigacion()->sync($proyecto_formulario_10_linea_69->proyecto->semillerosInvestigacion()->pluck('semilleros_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->gruposInvestigacion()->sync($proyecto_formulario_10_linea_69->proyecto->gruposInvestigacion()->pluck('grupos_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipios()->sync($proyecto_formulario_10_linea_69->proyecto->municipios()->pluck('municipios.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipiosAImpactar()->sync($proyecto_formulario_10_linea_69->proyecto->municipiosAImpactar()->pluck('municipios.id'));

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $proyecto_formulario_10_linea_69              = $modelo;
        $proyecto                           = Proyecto::find($proyecto_formulario_10_linea_69->proyecto->id);

        $sharepoint_proyecto_formulario_10_linea_69   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharepoint_path                    = "$modulo/$sharepoint_proyecto_formulario_10_linea_69";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_formulario_10_linea_69[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function updateMetodologiaProyectoFormulario10Linea69(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto->proyectoFormulario10Linea69()->update($request->all());

        $proyecto->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario10Linea69ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario10Linea69 $proyecto_formulario_10_linea_69, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_10_linea_69->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_10_linea_69->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_10_linea_69->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_10_linea_69->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_10_linea_69->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'centro_formacion_id') {
            $proyecto_formulario_10_linea_69->proyecto->update($request->only($column));
            return back();
        }

        $proyecto_formulario_10_linea_69->update($request->only($column));

        return back();
    }
}
