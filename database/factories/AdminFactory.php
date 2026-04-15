<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory()->create(['role' => 'admin'])->id,
            'fld_adm_id' => 'ADM-' . $this->faker->unique()->numerify('###'),
            'fld_adm_namaSekolah' => $this->faker->company() . ' School',
            'fld_adm_latitud' => $this->faker->latitude(),
            'fld_adm_longitud' => $this->faker->longitude(),
        ];
    }
}
