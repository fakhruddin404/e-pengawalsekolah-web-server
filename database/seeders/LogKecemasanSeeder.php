<?php

namespace Database\Seeders;

use App\Models\LogKecemasan;
use App\Models\Pengawal;
use Illuminate\Database\Seeder;
use RuntimeException;

class LogKecemasanSeeder extends Seeder
{
    public function run(): void
    {
        if (!Pengawal::query()->exists()) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila seed jadual pengawals dahulu sebelum LogKecemasanSeeder.');
        }

        LogKecemasan::factory()->count(5)->create();
    }
}

