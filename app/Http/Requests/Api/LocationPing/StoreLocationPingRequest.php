<?php

namespace App\Http\Requests\Api\LocationPing;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationPingRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Endpoint is protected by auth middleware; allow here.
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],

            'accuracy' => ['nullable', 'numeric', 'min:0'],
            'altitude' => ['nullable', 'numeric'],
            'heading' => ['nullable', 'numeric', 'between:0,360'],
            'speed' => ['nullable', 'numeric', 'min:0'],

            // ISO 8601 string (e.g. 2026-04-28T14:22:00+08:00)
            'timestamp' => ['required', 'date'],
        ];
    }
}

