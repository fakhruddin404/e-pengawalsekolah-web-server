<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pentadbir_sekolahs', function (Blueprint $table) {

            $table->string('fld_ps_id')->primary();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('fld_ps_noTelefon');
            $table->string('fld_ps_noIC')->unique();

            $table->enum('fld_ps_jabatan', ['Pengetua', 'Penyelia']);

            $table->enum('fld_ps_status', ['aktif', 'tidak_aktif'])->default('aktif');

            $table->string('fld_ps_urlGambarWajah')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pentadbir_sekolahs');
    }
};

