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
        Schema::create('idi', function (Blueprint $table) {
            $table->integer('id')->unique('idi_id_unique');

            $table->text('titulo');
            $table->text('video')->nullable();
            $table->text('justificacion_industria_4')->nullable();
            $table->text('justificacion_economia_naranja')->nullable();
            $table->text('justificacion_politica_discapacidad')->nullable();
            $table->text('resumen');
            $table->text('antecedentes');
            $table->text('marco_conceptual');
            $table->text('metodologia')->nullable();
            $table->integer('numero_aprendices');
            $table->text('impacto_municipios');
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion');
            $table->text('propuesta_sostenibilidad')->nullable();
            $table->text('bibliografia');
            $table->text('objetivo_general')->nullable();
            $table->text('problema_central')->nullable();
            $table->string('muestreo', 191)->nullable();
            $table->string('actividades_muestreo', 191)->nullable();
            $table->string('objetivo_muestreo', 191)->nullable();
            $table->string('relacionado_plan_tecnologico')->default(1)->comment('Si: 1, No: 2, No aplica: 3');
            $table->string('relacionado_agendas_competitividad')->default(1)->comment('Si: 1, No: 2, No aplica: 3');
            $table->string('relacionado_mesas_sectoriales')->default(1)->comment('Si: 1, No: 2, No aplica: 3');
            $table->string('relacionado_tecnoacademia')->default(1)->comment('Si: 1, No: 2, No aplica: 3');
            $table->text('justificacion_problema')->default('');
            $table->text('impacto_centro_formacion')->default('');
            $table->string('recoleccion_especimenes')->default(2);
            $table->float('max_meses_ejecucion', 0, 0)->default(0);
            $table->text('identificacion_problema')->default('');
            $table->boolean('articulacion_eni')->nullable();
            $table->boolean('proyecto_investigacion_pedagogica')->nullable();
            $table->text('justificacion_proyecto_investigacion_pedagogica')->nullable();
            $table->text('productividad_beneficiaros')->nullable();
            $table->text('generacion_empleo_beneficiarios')->nullable();
            $table->text('creacion_nuevos_desarrollos')->nullable();
            $table->text('generacion_conocimientos_beneficiarios')->nullable();
            $table->text('generacion_valor_beneficiarios')->nullable();
            $table->text('fortalecimiento_programas_formacion')->nullable();
            $table->text('transferencia_tecnologias')->nullable();
            $table->text('calidad_formacion')->nullable();
            $table->text('impacto_ambiental_proyectos')->nullable();
            $table->text('atencion_pluralista_diferencial')->nullable();
            $table->text('impacto_sector_agricola')->nullable();
            $table->integer('grupo_investigacion_eni_id')->nullable();
            $table->integer('disciplina_subarea_conocimiento_id');
            $table->integer('tematica_estrategica_id');
            $table->integer('red_conocimiento_id');
            $table->integer('linea_investigacion_id');
            $table->integer('actividad_economica_id');
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
        Schema::dropIfExists('idi');
    }
};
