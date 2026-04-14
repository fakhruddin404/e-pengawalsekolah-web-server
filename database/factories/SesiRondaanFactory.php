<?php

namespace Database\Factories;

use App\Models\Pengawal;
use App\Models\LokasiTitikSemak;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SesiRondaan>
 */
class SesiRondaanFactory extends Factory
{
    private static int $sequence = 1;
    public function definition(): array
    {
        $pengawalId = Pengawal::inRandomOrder()->value('fld_pgw_id');
        if (!$pengawalId) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum seed sesi_rondaans.');
        }

        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);

        $bilTitikSemak = LokasiTitikSemak::distinct()->count('fld_loc_id');

        $masaMula = $this->faker->dateTimeBetween('-14 days', 'now');
        $isTamat = $this->faker->boolean(70);
        $masaTamat = $isTamat
            ? (clone $masaMula)->modify('+' . $this->faker->numberBetween(20, 180) . ' minutes')
            : null;

        return [
            'fld_sr_idSesi' => 'SR-' . $idNumber,
            'fld_pgw_idPengawal' => $pengawalId,
            'fld_sr_masaMula' => $masaMula,
            'fld_sr_masaTamat' => $masaTamat,
            'fld_sr_urlGPX' => null,
            'fld_sr_jumlahTitikSemak' => $this->faker->numberBetween(1, $bilTitikSemak),
        ];
    }
}

