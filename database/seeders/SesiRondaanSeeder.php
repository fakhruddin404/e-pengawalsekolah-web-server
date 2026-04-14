<?php

namespace Database\Seeders;

use App\Models\Pengawal;
use App\Models\SesiRondaan;
use Illuminate\Database\Seeder;
use RuntimeException;

class SesiRondaanSeeder extends Seeder
{
    public function run(): void
    {
        if (!Pengawal::query()->exists()) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum SesiRondaanSeeder.');
        }

        SesiRondaan::factory()->count(5)->create();
    }
}

