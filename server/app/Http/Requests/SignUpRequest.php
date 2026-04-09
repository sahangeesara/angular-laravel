<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'=>'required|regex:/^[A-Z][a-z]{2,}.[\\s][A-Z][a-z]{2,}$/',
            'email' =>'required|email|unique:users',
            'password'=> 'required|confirmed',
            'is_customer' => 'sometimes|boolean',
            'customer_type' => 'sometimes|in:regular,system',
        ];
    }
}

