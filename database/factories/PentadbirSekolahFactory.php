<?php

namespace Database\Factories;

use App\Models\PentadbirSekolah;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PentadbirSekolah>
 */
class PentadbirSekolahFactory extends Factory
{
    protected $model = PentadbirSekolah::class;
    private static $sequence = 2;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);
        
        return [
            'fld_ps_id' => 'PTB-' . $idNumber,
            'user_id' => User::factory(), 
            'fld_ps_noTelefon' => '+601' . $this->faker->numerify('########'),
            'fld_ps_noIC' => $this->faker->numerify('######-##-####'),
            'fld_ps_jabatan' => $this->faker->randomElement(['Pengetua', 'Penyelia']),
            'fld_ps_status' => 'aktif',
            'fld_ps_urlGambarWajah' => null,
        ];
    }
}
