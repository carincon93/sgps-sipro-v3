<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TercerGrupoPresupuestal extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'tercer_grupo_presupuestal';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'codigo'
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
     * Relationship with RubroPresupuestal
     *
     * @return object
     */
    public function rubroPresupuestal()
    {
        return $this->hasMany(RubroPresupuestal::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterTercerGrupoPresupuestal($query, array $filters)
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
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }
}
