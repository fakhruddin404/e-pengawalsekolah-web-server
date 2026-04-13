<?php

namespace Database\Factories;

use App\Models\Pengawal;
use App\Models\LaporanKejadian;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LaporanKejadian>
 */
class LaporanKejadianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = LaporanKejadian::class;
    private static $sequence = 1;
    
    public function definition(): array
    {
        $kategori = $this->faker->randomElement(['Kerosakan', 'Pencerobohan', 'Kemalangan', 'Lain-lain']);
        $status = $this->faker->randomElement(['Baru', 'Dalam Siasatan', 'Selesai']);

        $pengawalId = Pengawal::inRandomOrder()->value('fld_pgw_id');
        if (!$pengawalId) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum seed laporan_kejadians.');
        }

        $imageName = 'RPT_' . str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT) . '.jpg';
        $imagePath = 'laporanImej/' . $imageName;

        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);

        return [
            'fld_rpt_idLaporan' => 'RPT-' . $idNumber,
            'fld_pgw_idPengawal' => $pengawalId,
            'fld_rpt_kategori' => $kategori,
            'fld_rpt_keterangan' => $this->faker->paragraph(2),
            'fld_rpt_urlGambar' => $imagePath,
            'fld_rpt_tarikhMasa' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'fld_rpt_latitud' => $this->faker->latitude(2.9, 3.2), 
            'fld_rpt_longitud' => $this->faker->longitude(101.5, 101.8),
            'fld_rpt_status' => $status,
        ];
    }
}
