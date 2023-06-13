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
        Schema::create('convocatorias', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion');
            $table->boolean('esta_activa');
            $table->date('min_fecha_inicio_proyectos_idi')->nullable();
            $table->date('max_fecha_finalizacion_proyectos_idi')->nullable();
            $table->date('min_fecha_inicio_proyectos_cultura')->nullable();
            $table->date('max_fecha_finalizacion_proyectos_cultura')->nullable();
            $table->date('min_fecha_inicio_proyectos_st')->nullable();
            $table->date('max_fecha_finalizacion_proyectos_st')->nullable();
            $table->date('min_fecha_inicio_proyectos_ta')->nullable();
            $table->date('max_fecha_finalizacion_proyectos_ta')->nullable();
            $table->date('min_fecha_inicio_proyectos_tp')->nullable();
            $table->date('max_fecha_finalizacion_proyectos_tp')->nullable();
            $table->string('fase')->nullable();
            $table->boolean('mostrar_recomendaciones')->nullable()->default(false);
            $table->date('fecha_finalizacion_fase')->nullable();
            $table->time('hora_finalizacion_fase')->nullable();
            $table->string('tipo_convocatoria')->nullable();
            $table->boolean('visible')->nullable();
            $table->boolean('idi_activa')->nullable();
            $table->boolean('st_activa')->nullable();
            $table->boolean('ta_activa')->nullable();
            $table->boolean('tp_activa')->nullable();
            $table->boolean('cultura_activa')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('convocatorias');
    }
};
