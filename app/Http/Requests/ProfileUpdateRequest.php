<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Whether this request only updates the account email (used by the standalone email form).
     */
    public function isEmailOnlyUpdate(): bool
    {
        $keys = collect($this->except(['_token', '_method']))->keys();

        return $keys->count() === 1 && $keys->first() === 'email';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();

        if ($this->isEmailOnlyUpdate()) {
            return match ($user->role) {
                'admin' => [
                    'email' => [
                        'required',
                        'string',
                        'lowercase',
                        'email',
                        'max:255',
                        Rule::unique(User::class)->ignore($user->id),
                    ],
                ],
                'pentadbir' => [
                    'email' => [
                        'required',
                        'string',
                        'email',
                        'max:255',
                        Rule::unique(User::class)->ignore($user->id),
                    ],
                ],
                default => [
                    'email' => [
                        'required',
                        'string',
                        'lowercase',
                        'email',
                        'max:255',
                        Rule::unique(User::class)->ignore($user->id),
                    ],
                ],
            };
        }

        return match ($user->role) {
            'admin' => [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'string',
                    'lowercase',
                    'email',
                    'max:255',
                    Rule::unique(User::class)->ignore($user->id),
                ],
                'fld_adm_namaSekolah' => ['required', 'string', 'max:255'],
                'fld_adm_latitud' => ['required', 'numeric'],
                'fld_adm_longitud' => ['required', 'numeric'],
            ],
            'pentadbir' => [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique(User::class)->ignore($user->id),
                ],
                'fld_ps_noTelefon' => ['required', 'string'],
                'fld_ps_noIC' => ['required', 'string', 'regex:/^\d{6}-\d{2}-\d{4}$/'],
                'fld_ps_jabatan' => ['required', 'string'],
                'fld_ps_status' => ['required', 'in:aktif,tidak_aktif'],
                'fld_ps_urlGambarWajah' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            ],
            default => [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'string',
                    'lowercase',
                    'email',
                    'max:255',
                    Rule::unique(User::class)->ignore($user->id),
                ],
            ],
        };
    }
}
