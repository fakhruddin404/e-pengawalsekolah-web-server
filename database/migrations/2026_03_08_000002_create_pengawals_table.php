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
        Schema::create('pengawals', function (Blueprint $table) {
            $table->string('fld_pgw_id')->primary();
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('fld_pgw_noTelefon');
            $table->string('fld_pgw_noIC');
            $table->enum('fld_pgw_status', ['aktif','tidak_aktif'])->default('aktif');
            $table->enum('fld_pgw_statusSemasa', [
                'bertugas',
                'tidak_bertugas'
            ])->default('tidak_bertugas');
            $table->string('fld_pgw_urlGambarWajah')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengawals');
    }
};

