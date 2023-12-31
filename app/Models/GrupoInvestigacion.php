<?php

namespace App\Models;

use App\Helpers\SharepointHelper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class GrupoInvestigacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'grupos_investigacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['filename', 'extension', 'nombre_carpeta_sharepoint', 'ruta_final_sharepoint', 'categoria_minciencias_text',  'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'centro_formacion_id',
        'nombre',
        'acronimo',
        'email',
        'enlace_gruplac',
        'codigo_minciencias',
        'categoria_minciencias',
        'mision',
        'vision',
        'fecha_creacion_grupo',
        'nombre_lider_grupo',
        'email_contacto',
        'programa_nal_ctei_principal',
        'programa_nal_ctei_secundaria',
        'reconocimientos_grupo_investigacion',
        'objetivo_general',
        'objetivos_especificos',
        'link_propio_grupo',
        'formato_gic_f_020',
        'formato_gic_f_032',
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
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineasInvestigacion()
    {
        return $this->hasMany(LineaInvestigacion::class);
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redesConocimiento()
    {
        return $this->belongsToMany(RedConocimiento::class, 'grupo_investigacion_red_conocimiento', 'grupo_investigacion_id', 'red_conocimiento_id');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_grupo_investigacion', 'grupo_investigacion_id', 'proyecto_id');
    }

    /**
     * Relationship with ProyectoFormulario8Linea66
     *
     * @return object
     */
    public function proyectoLinea66Eni()
    {
        return $this->hasMany(ProyectoFormulario8Linea66::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterGrupoInvestigacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $query->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id');
            $query->join('regionales', 'centros_formacion.regional_id', 'regionales.id');
            $query->whereRaw("unaccent(grupos_investigacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(centros_formacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(regionales.nombre) ilike unaccent('%" . $search . "%')");
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

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        $cleaned = SharepointHelper::cleanWordsFromSpecialCharacters($this->nombre);

        // Convert to uppercase
        return strtoupper($cleaned);
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->centroFormacion) {
            $ruta = trim('GRUPOS LÍNEAS Y SEMILLEROS/' . $this->centroFormacion->nombre_carpeta_sharepoint . '/' . $this->nombre_carpeta_sharepoint);
        }

        return $ruta;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'grupos-investigacion')) {

            $allowed_to_view      = Gate::inspect('view', [GrupoInvestigacion::class, $this]);
            $allowed_to_update    = Gate::inspect('update', [GrupoInvestigacion::class, $this]);
            $allowed_to_destroy   = Gate::inspect('delete', [GrupoInvestigacion::class, $this]);

            return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
        }
    }

    public function getFilenameAttribute()
    {
        $formato_gic_f_020_file_info   = pathinfo($this->formato_gic_f_020);
        $formato_gic_f_032_file_info   = pathinfo($this->formato_gic_f_032);

        $array_file_info = collect(['formato_gic_f_020_filename' =>  $formato_gic_f_020_file_info['filename'] ?? '', 'formato_gic_f_032_filename' => $formato_gic_f_032_file_info['filename'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getExtensionAttribute()
    {
        $formato_gic_f_020_file_info   = pathinfo($this->formato_gic_f_020);
        $formato_gic_f_032_file_info   = pathinfo($this->formato_gic_f_032);

        $array_file_info = collect(['formato_gic_f_020_extension' => $formato_gic_f_020_file_info['extension'] ?? '', 'formato_gic_f_032_extension' => $formato_gic_f_032_file_info['extension'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getCategoriaMincienciasTextAttribute()
    {
        $file_path  = 'json/categorias-minciencias.json';
        $id         = $this->categoria_minciencias;
        $key        = 'label';

        return $this->categoria_minciencias ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    private function getJsonItem($file_path, $id, $key)
    {
        $data   = json_decode(Storage::get($file_path), true);

        $where = function ($item) use ($id) {
            return $item['value'] == $id;
        };

        $filtered_data = array_filter($data, $where);

        return $filtered_data ? reset($filtered_data)[$key] : null;
    }
}
