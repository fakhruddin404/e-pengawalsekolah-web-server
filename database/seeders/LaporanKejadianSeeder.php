<?php

namespace Database\Seeders;

use App\Models\LaporanKejadian;
use App\Models\Pengawal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use RuntimeException;

class LaporanKejadianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!Pengawal::query()->exists()) {
            throw new RuntimeException('Tiada rekod Pengawal. Sila jalankan DatabaseSeeder (pengawals) dahulu sebelum LaporanKejadianSeeder.');
        }

        LaporanKejadian::factory(5)->create();
    }
}
