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
        Schema::create('sesi_rondaans', function (Blueprint $table) {

            $table->string('fld_sr_idSesi')->primary();

            $table->string('fld_pgw_idPengawal');

            $table->string('fld_sr_tempoh')->nullable();

            $table->json('fld_sr_pathRoute')->nullable();

            $table->integer('fld_sr_peratusTitikSemak');

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
        Schema::dropIfExists('sesi_rondaans');
    }
};
