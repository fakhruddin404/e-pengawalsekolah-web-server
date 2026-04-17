<?php

namespace Database\Seeders;

use App\Models\LokasiTitikSemak;
use Illuminate\Database\Seeder;

class LokasiTitikSemakSeeder extends Seeder
{
    public function run(): void
    {
        LokasiTitikSemak::factory(5)->create();
    }
}

