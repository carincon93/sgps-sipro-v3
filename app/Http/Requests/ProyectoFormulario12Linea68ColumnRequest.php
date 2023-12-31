<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario12Linea68ColumnRequest extends FormRequest
{
    private $columnsRules = [
        'tipo_proyecto_linea_68_id'         => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_proyecto_linea_68,id'],
        'estado_sistema_gestion_id'         => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:estados_sistema_gestion,id'],
        'titulo'                            => ['required', 'string'],
        'fecha_inicio'                      => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'sector_productivo'                 => ['required', 'min:0', 'max:2147483647', 'integer'],
        'nombre_area_tecnica'               => ['required', 'string', 'max:191'],

        'resumen'                           => ['required', 'string'],
        'antecedentes'                      => ['required', 'string'],
        'identificacion_problema'           => ['required', 'string'],
        'justificacion_problema'            => ['required', 'string'],
        'bibliografia'                      => ['required', 'string'],

        'programas_formacion'               => ['required', 'array'],
        'programas_formacion_relacionados'  => ['required', 'array'],
        'continuidad'                       => ['nullable', 'string'],
        'municipios_influencia'             => ['nullable', 'array'],
        'otras_zonas_influencia'            => ['nullable', 'string'],
        'video'                             => ['nullable', 'string'],
        'infraestructura_adecuada'          => ['nullable', 'boolean'],
        'especificaciones_area'             => ['nullable', 'string'],
    ];

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->columnsRules[$this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->route('column')]
            ];
        } else {
            return [
                'column' => 'required'
            ];
        }
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        //
    }
}
