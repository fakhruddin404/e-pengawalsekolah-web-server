<?php

namespace Database\Seeders;

use App\Models\Pelawat;
use Illuminate\Database\Seeder;

class PelawatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pelawat::factory()->count(15)->create();
    }
}
