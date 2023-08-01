<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Auth;

class ProyectoHubLinea69 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_hub_linea_69';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fecha_ejecucion'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'resumen',
        'fecha_inicio',
        'fecha_finalizacion',
        'resumen_regional',
        'antecedentes',
        'antecedentes_regional',
        'logros_vigencia_anterior',
        'contexto_general',
        'retos_locales_regionales',
        'estado_actual_departamento',
        'contribucion_desarrollo_empresas',
        'contribucion_agenda_regional_competitividad',
        'aportes_conpes_4011',
        'aportes_conpes_4080',
        'situacion_actual_produccion_agricola',
        'aportes_alternativas_generacion_electrica',
        'aportes_impulso_economia_popular',
        'justificacion_pertinencia',
        'acciones_estrategias_campesena',
        'bibliografia',
        'contribucion_formacion_centro_regional',
        'acciones_fortalecimiento_centro_regional',
        'acciones_participacion_aprendices',
        'acciones_aportes_por_edt',
        'acciones_fortalecimiento_programas_calificados',
        'acciones_categorizacion_grupos_investigacion',
        'oportunidades_fortalecimiento_proyectos_sennova',
        'proyeccion_articulacion_linea_68',
        'proyeccion_articulacion_linea_83',
        'oportunidades_fortalecimiento_convocatorias_innovacion',
        'proyeccion_articulacion_centros_empresariales',

        'problema_central',
        'objetivo_general',
        'metodologia',
        'metodologia_local',
        'areas_cualificacion_mnc',
        'talentos_otros_departamentos',
        'estrategia_atencion_talentos',
        'acciones_mejoramiento_idic',
        'municipios_beneficiados_vigencia_anterior',
        'beneficio_municipios_vigencia_anterior',
        'municipios_beneficiados_vigencia_actual',
        'estrategia_articulacion_pbts',
        'numero_empresas_atendidas',
        'analisis_impacto_sector_empresarial',
        'numero_emprendedores_atendidos',
        'analisis_impacto_regional',
        'gestion_alianzas_estrategicas',
        'estrategias_visibilizacion',
        'integracion_plan_tecnologico',
        'estrategias_productividad_agropecuaria',
        'acciones_estrategia_campesena',
        'estrategia_campesena_campesinos',
        'acciones_fortalecimiento_economia_popular',
        'acciones_fortalecimiento_idi',

        'identificacion_problema',
        'justificacion_problema',

        'nodo_tecnoparque_id',
        'proyecto_base',

    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        //
    ];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class, 'id');
    }

    /**
     * Relationship with NodoTecnoparque
     *
     * @return object
     */
    public function nodoTecnoparque()
    {
        return $this->belongsTo(NodoTecnoparque::class)->orderBy('nombre');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoHubLinea69($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('resumen', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('proyectos_hub_linea_69.id', $search - 8000);
            }
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    /**
     * getTituloAttribute
     *
     * @return void
     */
    public function getTituloAttribute()
    {
        return "Red Tecnoparque Nodo " . ucfirst($this->nodoTecnoparque->nombre) . " Vigencia " . date('Y', strtotime($this->fecha_inicio));
    }

    /**
     * getFechaEjecucionAttribute
     *
     * @return void
     */
    public function getFechaEjecucionAttribute()
    {
        $fecha_inicio       = Carbon::parse($this->fecha_inicio, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        $fecha_finalizacion = Carbon::parse($this->fecha_finalizacion, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        return "$fecha_inicio al $fecha_finalizacion";
    }

    /**
     * getProyectosPorRol
     *
     * @param  mixed $convocatoria
     * @return object
     */
    public static function getProyectosPorRol($convocatoria)
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyectos_hub_linea_69 = ProyectoHubLinea69::select('proyectos_hub_linea_69.id', 'proyectos_hub_linea_69.nodo_tecnoparque_id', 'proyectos_hub_linea_69.fecha_inicio', 'proyectos_hub_linea_69.fecha_finalizacion', 'proyectos_hub_linea_69.proyecto_base')
            ->join('proyectos', 'proyectos_hub_linea_69.id', 'proyectos.id')
            ->join('centros_formacion', 'proyectos.centro_formacion_id', 'centros_formacion.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {

                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 24, 27]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);

                        $query->join('proyectos', 'proyectos_hub_linea_69.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 17, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'proyectos_hub_linea_69.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('proyectos_hub_linea_69.id', 'ASC')
            ->filterProyectoHubLinea69(request()->only('search'))->paginate();

        $proyectos_hub_linea_69->load('proyecto');
        $proyectos_hub_linea_69->load('nodoTecnoparque');
        $proyectos_hub_linea_69->load('proyecto.evaluaciones');

        return $proyectos_hub_linea_69;
    }

    public function getProyectoBaseAttribute($value)
    {
        // Quemado - Ripoll
        if (Auth::user()->id == 122) {
            return true;
        }

        return $value;
    }

    public function getAreasCualificacionMncAttribute($value)
    {
        return json_decode($value);
    }

    public function getTalentosOtrosDepartamentosAttribute($value)
    {
        return json_decode($value);
    }

    public function getMunicipiosBeneficiadosVigenciaAnteriorAttribute($value)
    {
        return json_decode($value);
    }

    public function getMunicipiosBeneficiadosVigenciaActualAttribute($value)
    {
        return json_decode($value);
    }

}
