<?php

namespace Database\Factories;

use App\Models\Pelawat;
use App\Models\Pengawal;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PasLawatan>
 */
class PasLawatanFactory extends Factory
{
    private static int $sequence = 1;
    public function definition(): array
    {
        $pengawalId = Pengawal::inRandomOrder()->value('fld_pgw_id');
        if (!$pengawalId) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum seed pas_lawatans.');
        }

        $pelawatId = Pelawat::inRandomOrder()->value('fld_vis_id');
        if (!$pelawatId) {
            throw new RuntimeException('Tiada rekod Pelawat. Sila seed jadual pelawats dahulu sebelum seed pas_lawatans.');
        }

        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);

        $masaMasuk = $this->faker->dateTimeBetween('-14 days', 'now');
        $status = $this->faker->randomElement(['aktif', 'keluar', 'ditolak']);
        $masaKeluar = null;

        if ($status === 'keluar') {
            $masaKeluar = (clone $masaMasuk)->modify('+' . $this->faker->numberBetween(15, 180) . ' minutes');
        }

        if ($status === 'ditolak') {
            $masaKeluar = $masaMasuk;
        }

        return [
            'fld_pas_idPas' => 'PAS-' . $idNumber,
            'fld_pgw_idPengawal' => $pengawalId,
            'fld_vis_id' => $pelawatId,
            'fld_pas_tujuan' => $this->faker->randomElement([
                'Urusan pejabat',
                'Hantar dokumen',
                'Jumpa guru',
                'Ambil anak',
                'Lain-lain',
            ]),
            'fld_pas_noKenderaan' => strtoupper($this->faker->bothify('??? ####')),
            'fld_pas_masaMasuk' => $masaMasuk,
            'fld_pas_masaKeluar' => $masaKeluar,
            'fld_pas_statusPas' => $status,
        ];
    }
}

