<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoPresupuesto extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyecto_presupuesto';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['presupuesto_aprobado', 'item_page', 'filename', 'extension'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proyecto_id',
        'descripcion',
        'justificacion',
        'valor_total',
        'software',
        'codigo_uso_presupuestal',
        'formato_estudio_mercado',
        'concepto_viaticos'
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
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Relationship with Actividad
     *
     * @return object
     */
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'actividad_proyecto_presupuesto', 'proyecto_presupuesto_id', 'actividad_id');
    }

    /**
     * Relationship with ConvocatoriaPresupuesto
     *
     * @return object
     */
    public function convocatoriaProyectoRubrosPresupuestales()
    {
        return $this->belongsToMany(ConvocatoriaPresupuesto::class, 'convocatoria_proyecto_rubro_presupuestal', 'proyecto_presupuesto_id', 'convocatoria_presupuesto_id');
    }

    /**
     * Relationship with RubroPresupuestalProyectoLinea68
     *
     * @return object
     */
    public function rubroPresupuestalProyectoLinea68()
    {
        return $this->hasOne(RubroPresupuestalProyectoLinea68::class);
    }

    /**
     * Relationship with SoftwareInfo
     *
     * @return object
     */
    public function softwareInfo()
    {
        return $this->hasOne(SoftwareInfo::class);
    }

    /**
     * Relationship with NodoEditorialInfo
     *
     * @return object
     */
    public function nodoEditorialInfo()
    {
        return $this->hasOne(NodoEditorialInfo::class);
    }

    /**
     * Relationship with SoporteEstudioMercado
     *
     * @return object
     */
    public function soportesEstudioMercado()
    {
        return $this->hasMany(SoporteEstudioMercado::class)->orderBy('id');
    }

    /**
     * Relationship with Edt
     *
     * @return object
     */
    public function edt()
    {
        return $this->hasMany(Edt::class);
    }

    /**
     * Relationship with ViaticoMunicipio
     *
     * @return object
     */
    public function viaticosMunicipio()
    {
        return $this->hasMany(ViaticoMunicipio::class);
    }

    /**
     * Relationship with ProyectoPresupuestoEvaluacion
     *
     * @return object
     */
    public function proyectoPresupuestosEvaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\ProyectoPresupuestoEvaluacion::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoPresupuesto($query, array $filters)
    {
        // $query->join('convocatoria_presupuesto', 'proyecto_presupuesto.convocatoria_presupuesto_id', 'convocatoria_presupuesto.id');
        // $query->join('rubros_presupuestales', 'convocatoria_presupuesto.rubro_presupuestal_id', 'rubros_presupuestales.id');
        // $query->join('segundo_grupo_presupuestal', 'rubros_presupuestales.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id');
        // $query->when($filters['search'] ?? null, function ($query, $search) {
        //     $search = str_replace('"', "", $search);
        //     $search = str_replace("'", "", $search);
        //     $search = str_replace(' ', '%%', $search);
        //     $query->join('tercer_grupo_presupuestal', 'rubros_presupuestales.tercer_grupo_presupuestal_id', 'tercer_grupo_presupuestal.id');
        //     $query->join('usos_presupuestales', 'rubros_presupuestales.uso_presupuestal_id', 'usos_presupuestales.id');
        //     $query->whereRaw("unaccent(segundo_grupo_presupuestal.nombre) ilike unaccent('%" . $search . "%')");
        //     $query->orWhereRaw("unaccent(tercer_grupo_presupuestal.nombre) ilike unaccent('%" . $search . "%')");
        //     $query->orWhereRaw("unaccent(usos_presupuestales.descripcion) ilike unaccent('%" . $search . "%')");
        // })->when($filters['presupuestos'] ?? null, function ($query, $presupuesto) {
        //     $query->whereRaw("unaccent(segundo_grupo_presupuestal.nombre) ilike unaccent('%" . $presupuesto . "%')");
        // });
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

    public function getFilenameAttribute()
    {
        $fileInfo = pathinfo($this->formato_estudio_mercado);

        return $fileInfo['filename'] ?? '';
    }

    public function getExtensionAttribute()
    {
        $fileInfo = pathinfo($this->formato_estudio_mercado);

        return $fileInfo['extension'] ?? '';
    }

    /**
     * getTotalPresupuestoActividadesSennova
     *
     * @return int
     */
    public function getTotalPresupuestoActividadesSennova()
    {
        $total = 0;
        $countProductos = 0;
        foreach ($this->actividades()->get() as $actividad) {
            $countProductos += $actividad->productos()->count();
        }

        if ($countProductos > 0) {
            $total = $this->valor_total / $countProductos;
        }

        return $total;
    }

    public function getPresupuestoAprobadoAttribute()
    {
        $estado = '';

        if ($this->proyectoPresupuestosEvaluaciones()->count() > 0 && $this->proyectoPresupuestosEvaluaciones()->where('correcto', true)->count() > 0) {
            $estado = 'Aprobado';
        } else if ($this->proyectoPresupuestosEvaluaciones()->count() > 0 && $this->proyectoPresupuestosEvaluaciones()->where('correcto', false)->count() == $this->proyectoPresupuestosEvaluaciones()->count()) {
            $estado = 'Rechazado';
        } else if ($this->proyectoPresupuestosEvaluaciones()->count() == 0) {
            $estado = 'Sin evaluar';
        }

        return $estado;
    }

    public function getItemPageAttribute()
    {
        $presupuestos = ProyectoPresupuesto::where('proyecto_id', $this->proyecto_id)->orderBy('id')->get();

        $presupuestoIndex = $presupuestos->search(function ($proyectoPresupuesto) {
            return $proyectoPresupuesto->id === $this->id;
        });

        return ceil($presupuestoIndex / 15);
    }
}
