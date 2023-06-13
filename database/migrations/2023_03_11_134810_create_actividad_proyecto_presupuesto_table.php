<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actividad_proyecto_presupuesto', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('actividad_id');
            $table->integer('proyecto_presupuesto_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('actividad_proyecto_presupuesto');
    }
};
