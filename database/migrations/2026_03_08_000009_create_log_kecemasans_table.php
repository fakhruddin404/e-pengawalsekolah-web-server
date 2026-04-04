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
        Schema::create('log_kecemasans', function (Blueprint $table) {

            $table->string('fld_sos_id')->primary();

            $table->string('fld_pgw_idPengawal');

            $table->dateTime('fld_sos_masa');

            $table->decimal('fld_sos_latitud', 10, 7);
            $table->decimal('fld_sos_longitud', 10, 7);

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
        Schema::dropIfExists('log_kecemasans');
    }
};
