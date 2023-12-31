<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class LineaInvestigacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'lineas_investigacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'grupo_investigacion_id',
        'nombre',
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
     * Relationship with GrupoInvestigacion
     *
     * @return object
     */
    public function grupoInvestigacion()
    {
        return $this->belongsTo(GrupoInvestigacion::class);
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semillerosInvestigacion()
    {
        return $this->hasMany(SemilleroInvestigacion::class);
    }

    /**
     * Relationship with ProyectoFormulario3Linea61
     *
     * @return object
     */
    public function proyectoFormulario3Linea61()
    {
        return $this->hasMany(ProyectoFormulario3Linea61::class);
    }

    /**
     * Relationship with ProyectoFormulario13Linea65
     *
     * @return object
     */
    public function proyectosFormulario13Linea65()
    {
        return $this->hasMany(ProyectoFormulario13Linea65::class);
    }

    /**
     * Relationship with ProyectoFormulario15Linea65
     *
     * @return object
     */
    public function proyectoFormulario15Linea65()
    {
        return $this->hasOne(ProyectoFormulario15Linea65::class);
    }

    /**
     * Relationship with ProyectoFormulario8Linea66
     *
     * @return object
     */
    public function proyectosFormulario8Linea66()
    {
        return $this->hasMany(ProyectoFormulario8Linea66::class);
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->hasMany(AmbienteModernizacion::class);
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_linea_investigacion', 'linea_investigacion_id', 'proyecto_id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'linea_investigacion_programa_formacion', 'linea_investigacion_id', 'programa_formacion_id');
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semillerosInvestigacionArticulados()
    {
        return $this->belongsToMany(SemilleroInvestigacion::class, 'semillero_investigacion_linea_investigacion', 'linea_investigacion_id', 'semillero_investigacion_id');
    }

    /**
     * Relationship with ProyectoFormulario8Linea66
     *
     * @return object
     */
    public function proyectoLinea66Eni()
    {
        return $this->belongsToMany(ProyectoFormulario8Linea66::class, 'proyecto_linea_66_lineas_investigacion_eni', 'linea_investigacion_id', 'proyecto_linea_66_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterLineaInvestigacion($query, array $filters)
    {
        $query->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id');
        $query->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id');
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $query->whereRaw("unaccent(lineas_investigacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(grupos_investigacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(centros_formacion.nombre) ilike unaccent('%" . $search . "%')");
        })->when($filters['grupoInvestigacion'] ?? null, function ($query, $grupoInvestigacion) {
            $query->whereRaw("unaccent(grupos_investigacion.nombre) ilike unaccent('%" . $grupoInvestigacion . "%')");
        });
    }

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
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

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'lineas-investigacion')) {
            $allowedToView      = Gate::inspect('view', [LineaInvestigacion::class, $this]);
            $allowedToUpdate    = Gate::inspect('update', [LineaInvestigacion::class, $this]);
            $allowedToDestroy   = Gate::inspect('delete', [LineaInvestigacion::class, $this]);

            return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
        }
    }
}
