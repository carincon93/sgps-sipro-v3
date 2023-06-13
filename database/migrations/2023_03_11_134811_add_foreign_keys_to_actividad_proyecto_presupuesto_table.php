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
        Schema::table('actividad_proyecto_presupuesto', function (Blueprint $table) {
            $table->foreign(['actividad_id'], 'actividad_id_fkey')->references(['id'])->on('actividades')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_presupuesto_id'], 'proyecto_presupuesto_id_fkey')->references(['id'])->on('proyecto_presupuesto')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('actividad_proyecto_presupuesto', function (Blueprint $table) {
            $table->dropForeign('actividad_id_fkey');
            $table->dropForeign('proyecto_presupuesto_id_fkey');
        });
    }
};
