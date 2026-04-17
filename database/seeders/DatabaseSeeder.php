<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            LokasiTitikSemakSeeder::class,
            PengawalSeeder::class,
            PentadbirSekolahSeeder::class,
            PelawatSeeder::class,
            LaporanKejadianSeeder::class,
            PasLawatanSeeder::class,
            SesiRondaanSeeder::class,
            LogKecemasanSeeder::class,
        ]);
    }
}
