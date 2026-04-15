<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seeding a fixed test admin account
        $user = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        Admin::factory()->create([
            'user_id' => $user->id,
            'fld_adm_id' => 'ADM-001',
            'fld_adm_namaSekolah' => 'Sekolah Kebangsaan Utama',
            'fld_adm_latitud' => '2.9191850', 
            'fld_adm_longitud' => '101.7747620',
        ]);

        // Seed some random pseudo-admins
        Admin::factory()->count(1)->create();
    }
}
