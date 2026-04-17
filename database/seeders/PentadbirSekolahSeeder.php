<?php

namespace Database\Seeders;

use App\Models\PentadbirSekolah;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PentadbirSekolahSeeder extends Seeder
{
    public function run(): void
    {
        $pentadbirUser = User::factory()->create([
            'email' => 'pentadbir@gmail.com',
            'name' => 'Pentadbir Sekolah',
            'password' => Hash::make('password'),
            'role' => 'pentadbir',
        ]);

        PentadbirSekolah::factory()->create([
            'user_id' => $pentadbirUser->id,
            'fld_ps_id' => 'PTB-001',
            'fld_ps_status' => 'aktif',
            'fld_ps_noTelefon' => '+601' . app(\Faker\Generator::class)->numerify('########'),
            'fld_ps_noIC' => app(\Faker\Generator::class)->numerify('######-##-####'),
            'fld_ps_jabatan' => 'Pengetua',
            'fld_ps_urlGambarWajah' => null,
        ]);

        User::factory(5)->create(['role' => 'pentadbir'])->each(function ($user) {
            PentadbirSekolah::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}

