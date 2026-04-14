<?php

namespace Database\Seeders;

use App\Models\PasLawatan;
use App\Models\Pelawat;
use App\Models\Pengawal;
use Illuminate\Database\Seeder;
use RuntimeException;

class PasLawatanSeeder extends Seeder
{
    public function run(): void
    {
        if (!Pengawal::query()->exists()) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum PasLawatanSeeder.');
        }

        if (!Pelawat::query()->exists()) {
            throw new RuntimeException('Tiada rekod Pelawat. Sila seed jadual pelawats dahulu sebelum PasLawatanSeeder.');
        }

        PasLawatan::factory()->count(5)->create();
    }
}

