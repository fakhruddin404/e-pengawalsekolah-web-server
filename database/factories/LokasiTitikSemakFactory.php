<?php

namespace Database\Factories;

use App\Models\LokasiTitikSemak;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LokasiTitikSemakFactory extends Factory
{

    protected $model = LokasiTitikSemak::class;
    private static $sequence = 1;

    public function definition(): array
    {
        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);
        return [
            // Generate a fake ID like "PGW-8392"
            'fld_loc_id' => 'LTS-' . $idNumber,
            // Nama lokasi rawak (Cth: Blok A, Pintu Utama, dll)
            'fld_loc_nama' => 'Titik Semak ' . ucfirst($this->faker->word()),
            // Koordinat rawak (range lat/long sekitar Malaysia)
            'fld_loc_latitud' => $this->faker->latitude($min = 1.0, $max = 7.0),
            'fld_loc_longitud' => $this->faker->longitude($min = 99.0, $max = 119.0),
            'fld_loc_kodQR' => Str::random(15),
            'fld_loc_status' => $this->faker->boolean(80),
        ];
    }
}