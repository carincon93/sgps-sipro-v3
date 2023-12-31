<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsoPresupuestalRequest extends FormRequest
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
            'descripcion'   => ['required', 'string'],
            'codigo'        => ['required', 'integer', 'unique:usos_presupuestales,codigo', 'min:0', 'max:2147483647']
        ];
    }
}
