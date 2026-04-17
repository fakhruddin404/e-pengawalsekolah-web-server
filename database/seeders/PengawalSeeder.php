<?php

namespace Database\Seeders;

use App\Models\Pengawal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PengawalSeeder extends Seeder
{
    public function run(): void
    {
        $pengawalUser = User::factory()->create([
            'email' => 'pengawal@gmail.com',
            'name' => 'Pengawal',
            'password' => Hash::make('password'),
            'role' => 'pengawal',
        ]);

        Pengawal::factory()->create([
            'user_id' => $pengawalUser->id,
            'fld_pgw_id' => 'PGW-001',
            'fld_pgw_status' => 'aktif',
            'fld_pgw_statusSemasa' => 'tidak_bertugas',
            'fld_pgw_noTelefon' => '+601' . app(\Faker\Generator::class)->numerify('########'),
            'fld_pgw_noIC' => app(\Faker\Generator::class)->numerify('######-##-####'),
            'fld_pgw_urlGambarWajah' => null,
        ]);

        User::factory(25)->create(['role' => 'pengawal'])->each(function ($user) {
            Pengawal::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}

