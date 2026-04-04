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
        Schema::create('pelawats', function (Blueprint $table) {

            $table->string('fld_vis_id')->primary();

            $table->string('fld_vis_noIC')->unique();
            $table->string('fld_vis_namaPenuh');
            $table->string('fld_vis_noTelefon', 15);

            $table->string('fld_vis_noKenderaan')->nullable()->index();

            $table->string('fld_vis_urlGambarWajah')->nullable();

            $table->boolean('fld_vis_statusSenaraiHitam')->default(false);

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelawats');
    }
};
