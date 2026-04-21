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

        $bilTitikSemak = (int) LokasiTitikSemak::distinct()->count('fld_loc_id');
        $jumlahDilawat = $bilTitikSemak > 0 ? $this->faker->numberBetween(0, $bilTitikSemak) : 0;
        $peratusTitikSemak = $bilTitikSemak > 0
            ? (int) round(($jumlahDilawat / $bilTitikSemak) * 100)
            : 0;

        $tempohMinit = $this->faker->numberBetween(5, 180);

        $pathRoute = null;
        if ($bilTitikSemak > 0 && $jumlahDilawat > 0) {
            $pathRoute = LokasiTitikSemak::inRandomOrder()
                ->limit($jumlahDilawat)
                ->get(['fld_loc_id', 'fld_loc_nama', 'fld_loc_latitud', 'fld_loc_longitud'])
                ->map(fn ($t) => [
                    'fld_loc_id' => $t->fld_loc_id,
                    'nama' => $t->fld_loc_nama,
                    'lat' => $t->fld_loc_latitud,
                    'lng' => $t->fld_loc_longitud,
                ])
                ->values()
                ->all();
        }

        return [
            'fld_sr_idSesi' => 'SR-' . $idNumber,
            'fld_pgw_idPengawal' => $pengawalId,
            'fld_sr_tempoh' => $tempohMinit . ' min',
            'fld_sr_pathRoute' => $pathRoute,
            'fld_sr_peratusTitikSemak' => $peratusTitikSemak,
        ];
    }
}

