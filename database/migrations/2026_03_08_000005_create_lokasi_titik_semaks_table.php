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
        Schema::create('lokasi_titik_semaks', function (Blueprint $table) {

            $table->string('fld_loc_id')->primary();

            $table->string('fld_loc_nama');

            $table->decimal('fld_loc_latitud', 10, 8);
            $table->decimal('fld_loc_longitud', 11, 8);

            $table->string('fld_loc_kodQR')->unique();

            $table->boolean('fld_loc_status')->default(true);

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lokasi_titik_semaks');
    }
};
