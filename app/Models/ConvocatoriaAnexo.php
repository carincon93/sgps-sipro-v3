<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConvocatoriaAnexo extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'convocatoria_anexos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['nombre_carpeta_sharepoint', 'ruta_final_sharepoint'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'anexo_id',
        'habilitado',
        'obligatorio',
        'tipo_formulario_convocatoria_id'
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
     * Relationship with Anexo
     *
     * @return object
     */
    public function anexo()
    {
        return $this->belongsTo(Anexo::class);
    }

    /**
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatorias()
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Relationship with TipoFormularioConvocatoria
     *
     * @return object
     */
    public function tipoFormularioConvocatoria()
    {
        return $this->belongsTo(TipoFormularioConvocatoria::class);
    }

    /**
     * Relationship with ProyectoAnexo
     *
     * @return object
     */
    public function proyectoAnexo()
    {
        return $this->hasMany(ProyectoAnexo::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterAnexo($query, array $filters)
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

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper('FORMATOS CONVOCATORIA')));
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = trim($this->nombre_carpeta_sharepoint);

        return $ruta;
    }
}
