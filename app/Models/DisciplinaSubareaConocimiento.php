<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplinaSubareaConocimiento extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'disciplinas_subarea_conocimiento';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subarea_conocimiento_id',
        'nombre'
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
     * Relationship with SubareaConocimiento
     *
     * @return object
     */
    public function subareaConocimiento()
    {
        return $this->belongsTo(SubareaConocimiento::class);
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
     * Relationship with ProyectoFormulario1Linea65
     *
     * @return object
     */
    public function proyectosFormulario1Linea65()
    {
        return $this->hasMany(ProyectoFormulario1Linea65::class);
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
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->hasMany(AmbienteModernizacion::class);
    }

    /**
     * Relationship with ProyectoCapacidadInstalada
     *
     * @return void
     */
    public function proyectosCapacidadInstalada()
    {
        return $this->hasMany(ProyectoCapacidadInstalada::class);
    }

    /**
     * Relationship with User
     *
     * @return void
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relationship with ProyectoFormulario4Linea70
     *
     * @return object
     */
    public function proyectoFormulario4Linea70()
    {
        return $this->belongsToMany(ProyectoFormulario4Linea70::class, 'proyecto_linea_70_disciplina_subarea_conocimiento', 'disciplina_subarea_conocimiento_id', 'proyecto_linea_70_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterDisciplinaSubareaConocimiento($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(nombre) ilike unaccent('%" . $search . "%')");
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }
}
