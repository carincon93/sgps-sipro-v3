<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaAnexoRequest extends FormRequest
{
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
        return [
            'tipo_formulario_convocatoria_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_formulario_convocatoria,id'],
            'anexo_id'                          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:anexos,id'],
            'obligatorio'                       => ['nullable', 'boolean'],
            'habilitado'                        => ['nullable', 'boolean'],
        ];
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
