<?php

namespace Database\Factories;

use App\Models\Pengawal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengawalFactory extends Factory
{
    protected $model = Pengawal::class;
    private static $sequence = 2;

    public function definition(): array
    {
        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);
        return [
            // Generate a fake ID like "PGW-839"
            'fld_pgw_id' => 'PGW-' . $idNumber,
            
            // Link to a user (This will be overwritten in the seeder, but good for fallback)
            'user_id' => User::factory(), 
            
            'fld_pgw_noTelefon' => '+601' . $this->faker->numerify('########'),
            'fld_pgw_noIC' => $this->faker->numerify('######-##-####'),
            'fld_pgw_status' => 'tidak_aktif',
            'fld_pgw_statusSemasa' => 'tidak_bertugas',
            'fld_pgw_urlGambarWajah' => null,
        ];
    }
}