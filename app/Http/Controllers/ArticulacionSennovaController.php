<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ArticulacionSennovaColumnRequest;
use App\Http\Requests\ArticulacionSennovaRequest;
use App\Models\AulaMovil;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario4Linea70;
use App\Models\LineaInvestigacion;
use App\Models\Proyecto;
use App\Models\RolSennova;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticulacionSennovaController extends Controller
{
    /**
     * showArticulacionSennova
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArticulacionSennova(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto->load('participantes.centroFormacion.regional');
        $proyecto->load('evaluaciones', 'proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        if ($proyecto->tipo_formulario_convocatoria_id != 4 && $proyecto->tipo_formulario_convocatoria_id != 5 && $proyecto->tipo_formulario_convocatoria_id != 10 && $proyecto->tipo_formulario_convocatoria_id != 11 && $proyecto->tipo_formulario_convocatoria_id != 17) {
            return back()->with('error', 'No puede acceder a este módulo.');
        }

        $proyecto->precio_proyecto = $proyecto->precioProyecto;
        $proyecto->participantes;
        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto->tipoFormularioConvocatoria->tiposFormularioConvocatoria;
        $proyecto->gruposInvestigacion;
        $proyecto->lineasInvestigacion;
        $proyecto->semillerosInvestigacion;
        $proyecto->redesConocimiento;

        $proyecto->proyectoFormulario5Linea69;
        $proyecto->proyectoFormulario10Linea69;
        $proyecto->proyectoFormulario17Linea69;
        optional($proyecto->proyectoFormulario4Linea70)->disciplinasSubareaConocimiento;
        optional($proyecto->proyectoFormulario4Linea70)->actividadesEconomicas;
        optional($proyecto->proyectoFormulario4Linea70)->tematicasEstrategicas;
        optional($proyecto->proyectoFormulario4Linea70)->proyectosIdiTecnoacademia;
        $proyecto->proyectoFormulario11Linea83;


        return Inertia::render('Convocatorias/Proyectos/ArticulacionSennova/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                          => $proyecto,
            'evaluacion'                        => $items_evaluacion ?? [],
            'lineas_investigacion'              => LineaInvestigacion::selectRaw('lineas_investigacion.id as value, concat(lineas_investigacion.nombre, chr(10), \'∙ Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label')->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')->where('grupos_investigacion.centro_formacion_id', $proyecto->centroFormacion->id)->get(),
            'grupos_investigacion'              => SelectHelper::gruposInvestigacion()->where('regional_id', $proyecto->centroFormacion->regional->id)->values()->all(),
            'semilleros_investigacion'          => SelectHelper::semillerosInvestigacion()->where('centro_formacion_id', $proyecto->centroFormacion->id)->values()->all(),
            'redes_conocimiento'                => SelectHelper::redesConocimiento(),
            'tematicas_estrategicas'            => SelectHelper::tematicasEstrategicas(),
            'actividades_economicas'            => SelectHelper::actividadesEconomicas(),
            'disciplinas_subarea_conocimiento'  => SelectHelper::disciplinasSubareaConocimiento(),
            'proyectos_idi_tecnoacademia'       => SelectHelper::proyectosIdiTecnoacademia(),
            'tipos_documento'                   => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tipos_vinculacion'                 => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'centros_formacion'                 => SelectHelper::centrosFormacion(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nuevo_participante'                => User::select('users.id', 'users.nombre', 'users.email', 'users.centro_formacion_id')->with('centroFormacion', 'centroFormacion.regional')->orderBy('users.nombre', 'ASC')->filterUser(request()->only('search'))->first(),
            'autor_principal'                   => $proyecto->participantes()->where('proyecto_participantes.es_formulador', true)->first(),
            'tecnoacademia_relacionada'         => $proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'aulas_moviles'                     => AulaMovil::where('proyecto_formulario4_linea70_id', $proyecto->id)->get(),
        ]);
    }

    /**
     * storeArticulacionSennova
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function storeArticulacionSennova(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $request->merge([
            'semilleros_investigacion'  => is_array($request->semilleros_investigacion) && count($request->semilleros_investigacion) == 0 ? null : $request->semilleros_investigacion,
            'grupos_investigacion'      => is_array($request->grupos_investigacion) && count($request->grupos_investigacion) == 0 ? null : $request->grupos_investigacion
        ]);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 4:
                $request->validate([
                    'lineas_investigacion*'             => 'required|integer|min:0|max:2147483647|exists:lineas_investigacion,id',
                    'grupos_investigacion*'             => 'required|integer|min:0|max:2147483647|exists:grupos_investigacion,id',
                    'semilleros_investigacion*'         => 'nullable|integer|min:0|max:2147483647|exists:semilleros_investigacion,id',
                    'disciplinas_subarea_conocimiento*' => 'required|integer|min:0|max:2147483647|exists:disciplinas_subarea_conocimiento,id',
                    'redes_conocimiento*'               => 'required|integer|min:0|max:2147483647|exists:redes_conocimiento,id',
                    'tematicas_estrategicas*'           => 'required|integer|min:0|max:2147483647|exists:tematicas_estrategicas,id',
                    'proyecto_idi_tecnoacademia_id*'    => 'required|integer|min:0|max:2147483647|exists:proyectos_idi_tecnoacademia,id',
                    'actividades_economicas*'           => 'required|integer|min:0|max:2147483647|exists:actividades_economicas,id',
                    'articulacion_semillero'            => 'required|min:0|max:2|integer',
                    'semilleros_en_formalizacion'       => 'nullable|json',
                ]);

                $proyecto->proyectoFormulario4Linea70->update([
                    'proyectos_ejecucion'               => $request->proyectos_ejecucion,
                    'articulacion_semillero'            => $request->articulacion_semillero,
                    'semilleros_en_formalizacion'       => $request->semilleros_en_formalizacion,
                    'articulacion_centro_formacion'     => $request->articulacion_centro_formacion,
                    'lineas_medulares_centro'           => $request->lineas_medulares_centro,
                    'articulacion_programas_centro'     => $request->articulacion_programas_centro,
                    'articulacion_bienestar_aprendiz'   => $request->articulacion_bienestar_aprendiz,
                    'favorecimiento_ruta_formacion'     => $request->favorecimiento_ruta_formacion,
                ]);

                if ($request->articulacion_semillero == 1) {
                    $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);
                } else {
                    $proyecto->semillerosInvestigacion()->sync([]);
                }

                $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
                $proyecto->lineasInvestigacion()->sync($request->lineas_investigacion);
                $proyecto->proyectoFormulario4Linea70->actividadesEconomicas()->sync($request->actividades_economicas);
                $proyecto->proyectoFormulario4Linea70->disciplinasSubareaConocimiento()->sync($request->disciplinas_subarea_conocimiento);
                $proyecto->redesConocimiento()->sync($request->redes_conocimiento);
                $proyecto->proyectoFormulario4Linea70->tematicasEstrategicas()->sync($request->tematicas_estrategicas);
                $proyecto->proyectoFormulario4Linea70->proyectosIdiTecnoacademia()->sync($request->proyecto_idi_tecnoacademia_id);

                break;

            case 5:
                $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
                $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);

                $proyecto->proyectoFormulario5Linea69->update([
                    'impacto_centro_formacion'              => $request->impacto_centro_formacion,
                    'aportacion_semilleros_grupos'          => $request->aportacion_semilleros_grupos,
                    'proyeccion_con_st'                     => $request->proyeccion_con_st,
                    'proyeccion_extensionismo_tecnologico'  => $request->proyeccion_extensionismo_tecnologico,
                    'proyeccion_centros_desarrollo'         => $request->proyeccion_centros_desarrollo,
                    'proyeccion_formacion_regional'         => $request->proyeccion_formacion_regional,
                ]);
                break;

            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function storeArticulacionSennovaProyectosFormulario10Linea69(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $request->merge([
            'semilleros_investigacion'  => is_array($request->semilleros_investigacion) && count($request->semilleros_investigacion) == 0 ? null : $request->semilleros_investigacion,
            'grupos_investigacion'      => is_array($request->grupos_investigacion) && count($request->grupos_investigacion) == 0 ? null : $request->grupos_investigacion
        ]);

        $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
        $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);

        $proyecto->proyectoFormulario10Linea69->update([
            'contribucion_formacion_centro_regional'                    => $request->contribucion_formacion_centro_regional,
            'acciones_fortalecimiento_centro_regional'                  => $request->acciones_fortalecimiento_centro_regional,
            'acciones_participacion_aprendices'                         => $request->acciones_participacion_aprendices,
            'acciones_aportes_por_edt'                                  => $request->acciones_aportes_por_edt,
            'acciones_fortalecimiento_programas_calificados'            => $request->acciones_fortalecimiento_programas_calificados,
            'acciones_categorizacion_grupos_investigacion'              => $request->acciones_categorizacion_grupos_investigacion,
            'oportunidades_fortalecimiento_proyectos_sennova'           => $request->oportunidades_fortalecimiento_proyectos_sennova,
            'proyeccion_articulacion_linea_68'                          => $request->proyeccion_articulacion_linea_68,
            'proyeccion_articulacion_linea_83'                          => $request->proyeccion_articulacion_linea_83,
            'oportunidades_fortalecimiento_convocatorias_innovacion'    => $request->oportunidades_fortalecimiento_convocatorias_innovacion,
            'proyeccion_articulacion_centros_empresariales'             => $request->proyeccion_articulacion_centros_empresariales,
        ]);

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function storeArticulacionSennovaProyectosFormulario17Linea69(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $request->merge([
            'semilleros_investigacion'  => is_array($request->semilleros_investigacion) && count($request->semilleros_investigacion) == 0 ? null : $request->semilleros_investigacion,
            'grupos_investigacion'      => is_array($request->grupos_investigacion) && count($request->grupos_investigacion) == 0 ? null : $request->grupos_investigacion
        ]);

        $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
        $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);

        $proyecto->proyectoFormulario17Linea69->update([
            'contribucion_formacion_centro_regional'                    => $request->contribucion_formacion_centro_regional,
            'acciones_fortalecimiento_centro_regional'                  => $request->acciones_fortalecimiento_centro_regional,
            'acciones_participacion_aprendices'                         => $request->acciones_participacion_aprendices,
            'acciones_aportes_por_edt'                                  => $request->acciones_aportes_por_edt,
            'acciones_fortalecimiento_programas_calificados'            => $request->acciones_fortalecimiento_programas_calificados,
            'acciones_categorizacion_grupos_investigacion'              => $request->acciones_categorizacion_grupos_investigacion,
            'oportunidades_fortalecimiento_proyectos_sennova'           => $request->oportunidades_fortalecimiento_proyectos_sennova,
            'proyeccion_articulacion_linea_68'                          => $request->proyeccion_articulacion_linea_68,
            'proyeccion_articulacion_linea_83'                          => $request->proyeccion_articulacion_linea_83,
            'oportunidades_fortalecimiento_convocatorias_innovacion'    => $request->oportunidades_fortalecimiento_convocatorias_innovacion,
            'proyeccion_articulacion_centros_empresariales'             => $request->proyeccion_articulacion_centros_empresariales,
        ]);

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function storeArticulacionSennovaProyectosLinea83(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $proyecto->proyectoFormulario11Linea83->update([
            'impacto_centros_formacion'                     => $request->impacto_centros_formacion,
            'articulacion_semilleros_grupos_investigacion'  => $request->articulacion_semilleros_grupos_investigacion,
            'articulacion_linea_68'                         => $request->articulacion_linea_68,
            'articulacion_linea_69_y_hubs'                  => $request->articulacion_linea_69_y_hubs,
            'articulacion_centros_desarrollo_empresarial'   => $request->articulacion_centros_desarrollo_empresarial,
            'contribucion_formacion_regional_nacional'      => $request->contribucion_formacion_regional_nacional,
            'proyeccion_capacidades_tecnologicas_empresas'  => $request->proyeccion_capacidades_tecnologicas_empresas,
        ]);

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateLongColumn(ArticulacionSennovaColumnRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, $column)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 4:
                if ($column == 'grupos_investigacion') {
                    $proyecto->gruposInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'lineas_investigacion') {
                    $proyecto->lineasInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'actividades_economicas') {
                    $proyecto->proyectoFormulario4Linea70->actividadesEconomicas()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'disciplinas_subarea_conocimiento') {
                    $proyecto->proyectoFormulario4Linea70->disciplinasSubareaConocimiento()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'redes_conocimiento') {
                    $proyecto->redesConocimiento()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'tematicas_estrategicas') {
                    $proyecto->proyectoFormulario4Linea70->tematicasEstrategicas()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'proyecto_idi_tecnoacademia_id') {
                    $proyecto->proyectoFormulario4Linea70->proyectosIdiTecnoacademia()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario4Linea70()->update($request->only($column));
                break;
            case 5:
                if ($column == 'grupos_investigacion') {
                    $proyecto->gruposInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'semilleros_investigacion') {
                    $proyecto->semillerosInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario5Linea69()->update($request->only($column));
                break;
            case 10:
                if ($column == 'grupos_investigacion') {
                    $proyecto->gruposInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'semilleros_investigacion') {
                    $proyecto->semillerosInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario10Linea69()->update($request->only($column));
                break;
            case 11:
                $proyecto->proyectoFormulario11Linea83()->update($request->only($column));
                break;
            case 17:
                if ($column == 'grupos_investigacion') {
                    $proyecto->gruposInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'semilleros_investigacion') {
                    $proyecto->semillerosInvestigacion()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario17Linea69()->update($request->only($column));
                break;
            default:
                break;
        }

        return back();
    }
}
