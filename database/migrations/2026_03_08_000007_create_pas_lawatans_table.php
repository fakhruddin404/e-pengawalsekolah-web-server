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
        Schema::create('pas_lawatans', function (Blueprint $table) {

            $table->string('fld_pas_idPas')->primary();

            $table->string('fld_pgw_idPengawal');
            $table->string('fld_vis_id');

            $table->string('fld_pas_tujuan');

            $table->dateTime('fld_pas_masaMasuk');
            $table->dateTime('fld_pas_masaKeluar')->nullable();

            $table->enum('fld_pas_statusPas', [
                'aktif',
                'keluar',
                'ditolak'
            ])->default('aktif');

            $table->timestamps();

            $table->foreign('fld_pgw_idPengawal')
                ->references('fld_pgw_id')
                ->on('pengawals')
                ->cascadeOnDelete();

            $table->foreign('fld_vis_id')
                ->references('fld_vis_id')
                ->on('pelawats')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pas_lawatans');
    }
};
