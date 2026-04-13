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
        Schema::create('laporan_kejadians', function (Blueprint $table) {

            $table->string('fld_rpt_idLaporan')->primary();

            $table->string('fld_pgw_idPengawal');

            $table->string('fld_rpt_kategori');
            $table->text('fld_rpt_keterangan');

            $table->string('fld_rpt_urlGambar')->nullable();

            $table->dateTime('fld_rpt_tarikhMasa');

            $table->decimal('fld_rpt_latitud', 10, 7);
            $table->decimal('fld_rpt_longitud', 10, 7);

            $table->enum('fld_rpt_status', [
                'Baru',
                'Dalam Siasatan',
                'Selesai'
            ])->default('Baru');

            $table->timestamps();

            $table->foreign('fld_pgw_idPengawal')
                ->references('fld_pgw_id')
                ->on('pengawals')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_kejadians');
    }
};
