<?php

namespace Database\Factories;

use App\Models\Pengawal;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LogKecemasan>
 */
class LogKecemasanFactory extends Factory
{
    private static int $sequence = 1;
    public function definition(): array
    {
        $pengawalId = Pengawal::inRandomOrder()->value('fld_pgw_id');
        if (!$pengawalId) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum seed log_kecemasans.');
        }

        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);

        return [
            'fld_sos_id' => 'SOS-' . $idNumber,
            'fld_pgw_idPengawal' => $pengawalId,
            'fld_sos_masa' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'fld_sos_latitud' => $this->faker->latitude(2.9, 3.2),
            'fld_sos_longitud' => $this->faker->longitude(101.5, 101.8),
        ];
    }
}

