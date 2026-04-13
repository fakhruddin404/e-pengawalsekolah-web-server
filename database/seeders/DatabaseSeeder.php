<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pengawal;
use App\Models\PentadbirSekolah;
use App\Models\LokasiTitikSemak;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Pentadbir Sekolah',
            'email' => 'pentadbir@gmail.com',
            'role' => 'pentadbir',
        ]);

        User::factory(25)->create(['role' => 'pengawal'])->each(function ($user) {

            Pengawal::factory()->create([
                'user_id' => $user->id,
            ]);
            
        });

        User::factory(5)->create(['role' => 'pentadbir'])->each(function ($user) {

            PentadbirSekolah::factory()->create([
                'user_id' => $user->id,
            ]);
            
        });

        LokasiTitikSemak::factory(5)->create();

        $this->call([
            LaporanKejadianSeeder::class,
            PelawatSeeder::class,
        ]);
    }
}
