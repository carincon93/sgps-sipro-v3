import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import RadioMui from '@/Components/Radio'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'

import { Grid, RadioGroup } from '@mui/material'

import { router, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import { checkRole, monthDiff } from '@/Utils'

const Form = ({
    auth_user,
    method = 'POST',
    convocatoria,
    proyecto_formulario_8_linea_66,
    evaluacion,
    centros_formacion,
    tecnoacademia,
    mesas_sectoriales,
    areas_conocimiento,
    subareas_conocimiento,
    disciplinas_subarea_conocimiento,
    actividades_economicas,
    tematicas_estrategicas,
    redes_conocimiento,
    lineas_tecnoacademia,
    lineas_investigacion,
    tecnoacademias,
    municipios,
    grupos_investigacion,
    areas_tematicas_eni,
    lineas_investigacion_eni,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    areas_cualificacion_mnc,
    lineas_estrategicas,
    roles_sennova,
    allowed_to_create,
    ...props
}) => {
    const is_super_admin = checkRole(auth_user, [1])

    const [array_lineas_tecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const [tiene_video, setTieneVideo] = useState(proyecto_formulario_8_linea_66?.video !== null)
    const [requiere_justificacion_industria4, setRequiereJustificacionIndustria4] = useState(proyecto_formulario_8_linea_66?.justificacion_industria_4 !== null)
    const [requiere_justificacion_economia_naranja, setRequiereJustificacionEconomiaNaranja] = useState(proyecto_formulario_8_linea_66?.justificacion_economia_naranja !== null)
    const [requiere_justificacion_politica_discapacidad, setRequiereJustificacionPoliticaDiscapacidad] = useState(proyecto_formulario_8_linea_66?.justificacion_politica_discapacidad !== null)
    const [requiere_justificacion_atencion_pluralista, setRequiereJustificacionAntencionPluralista] = useState(proyecto_formulario_8_linea_66?.atencion_pluralista_diferencial !== null)
    const [requiere_justificacion_sector_agricola, setRequiereJustificacionSectorAgricola] = useState(proyecto_formulario_8_linea_66?.impacto_sector_agricola !== null)
    const [array_lineas_investigacion, setArrayLineasInvestigacion] = useState([])

    const form = useForm({
        titulo: proyecto_formulario_8_linea_66?.titulo ?? '',
        fecha_inicio: proyecto_formulario_8_linea_66?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_formulario_8_linea_66?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_formulario_8_linea_66?.max_meses_ejecucion ?? '',
        centro_formacion_id: proyecto_formulario_8_linea_66?.proyecto?.centro_formacion_id ?? null,
        linea_investigacion_id: proyecto_formulario_8_linea_66?.linea_investigacion_id ?? null,
        red_conocimiento_id: proyecto_formulario_8_linea_66?.red_conocimiento_id ?? null,
        disciplina_subarea_conocimiento_id: proyecto_formulario_8_linea_66?.disciplina_subarea_conocimiento_id ?? null,
        tematica_estrategica_id: proyecto_formulario_8_linea_66?.tematica_estrategica_id ?? null,
        actividad_economica_id: proyecto_formulario_8_linea_66?.actividad_economica_id ?? null,
        grupo_investigacion_eni_id: proyecto_formulario_8_linea_66?.grupo_investigacion_eni_id,
        video: proyecto_formulario_8_linea_66?.video,
        numero_aprendices: proyecto_formulario_8_linea_66?.numero_aprendices,
        municipios: proyecto_formulario_8_linea_66?.proyecto.municipios?.map((item) => item.id) ?? null,

        programas_formacion: proyecto_formulario_8_linea_66?.proyecto.programas_formacion.map((item) => item.id) ?? null,

        area_tematica_eni_id: proyecto_formulario_8_linea_66?.areas_tematicas_eni ? proyecto_formulario_8_linea_66?.areas_tematicas_eni?.map((item) => item.id) : null,
        linea_investigacion_eni_id: proyecto_formulario_8_linea_66?.lineas_investigacion_eni?.map((item) => item.id) ?? null,

        tecnoacademia_id: tecnoacademia?.id ?? '',
        linea_tecnologica_id: proyecto_formulario_8_linea_66?.proyecto.tecnoacademia_lineas_tecnoacademia?.map((item) => item.id) ?? null,
        mesa_sectorial_id: proyecto_formulario_8_linea_66?.proyecto.mesas_sectoriales?.map((item) => item.id),

        muestreo: proyecto_formulario_8_linea_66?.muestreo ?? '',
        actividades_muestreo: proyecto_formulario_8_linea_66?.actividades_muestreo ?? '',
        objetivo_muestreo: proyecto_formulario_8_linea_66?.objetivo_muestreo ?? '',
        recoleccion_especimenes: proyecto_formulario_8_linea_66?.recoleccion_especimenes ?? '',
        relacionado_plan_tecnologico: proyecto_formulario_8_linea_66?.relacionado_plan_tecnologico ?? '',
        relacionado_agendas_competitividad: proyecto_formulario_8_linea_66?.relacionado_agendas_competitividad ?? '',
        relacionado_mesas_sectoriales: proyecto_formulario_8_linea_66?.relacionado_mesas_sectoriales ?? '',
        relacionado_tecnoacademia: proyecto_formulario_8_linea_66?.relacionado_tecnoacademia ?? '',
        proyecto_investigacion_pedagogica: proyecto_formulario_8_linea_66?.proyecto_investigacion_pedagogica,
        articulacion_eni: proyecto_formulario_8_linea_66?.articulacion_eni,
        justificacion_proyecto_investigacion_pedagogica: proyecto_formulario_8_linea_66?.justificacion_proyecto_investigacion_pedagogica ?? '',

        resumen: proyecto_formulario_8_linea_66?.resumen ?? '',
        antecedentes: proyecto_formulario_8_linea_66?.antecedentes ?? '',
        marco_conceptual: proyecto_formulario_8_linea_66?.marco_conceptual ?? '',
        justificacion_industria_4: proyecto_formulario_8_linea_66?.justificacion_industria_4 ?? '',
        justificacion_economia_naranja: proyecto_formulario_8_linea_66?.justificacion_economia_naranja ?? '',
        justificacion_politica_discapacidad: proyecto_formulario_8_linea_66?.justificacion_politica_discapacidad ?? '',
        atencion_pluralista_diferencial: proyecto_formulario_8_linea_66?.atencion_pluralista_diferencial ?? '',
        impacto_sector_agricola: proyecto_formulario_8_linea_66?.impacto_sector_agricola ?? '',
        bibliografia: proyecto_formulario_8_linea_66?.bibliografia ?? '',
        impacto_municipios: proyecto_formulario_8_linea_66?.impacto_municipios ?? '',
        impacto_centro_formacion: proyecto_formulario_8_linea_66?.impacto_centro_formacion ?? '',

        // Campos 2023
        aporta_a_campesena: proyecto_formulario_8_linea_66?.aporta_a_campesena,
        relacionado_estrategia_campesena: proyecto_formulario_8_linea_66?.relacionado_estrategia_campesena,
        justificacion_relacion_campesena: proyecto_formulario_8_linea_66?.justificacion_relacion_campesena,
        lineas_estrategicas_convocatoria: proyecto_formulario_8_linea_66?.lineas_estrategicas_convocatoria,
        justificacion_lineas_estrategicas: proyecto_formulario_8_linea_66?.justificacion_lineas_estrategicas,
        impacto_regional: proyecto_formulario_8_linea_66?.impacto_regional,
        justificacion_impacto_regional: proyecto_formulario_8_linea_66?.justificacion_impacto_regional,
        justificacion_mesas_sectoriales: proyecto_formulario_8_linea_66?.justificacion_mesas_sectoriales,
        areas_cualificacion_mnc: proyecto_formulario_8_linea_66?.areas_cualificacion_mnc,
        lineas_estrategicas_beneficiadas: proyecto_formulario_8_linea_66?.lineas_estrategicas_beneficiadas,
        justificacion_lineas_estrategicas_beneficiadas: proyecto_formulario_8_linea_66?.justificacion_lineas_estrategicas_beneficiadas,
        veredas_corregimientos: proyecto_formulario_8_linea_66?.veredas_corregimientos,

        cantidad_meses: '',
        cantidad_horas: '',
        rol_sennova: null,
    })

    useEffect(() => {
        const filtered_lineas_tecnoacademia = lineas_tecnoacademia?.filter((obj) => obj.tecnoacademia_id === form.data.tecnoacademia_id)
        setArrayLineasTecnoacademia(filtered_lineas_tecnoacademia)
    }, [form.data.tecnoacademia_id])

    useEffect(() => {
        if (form.data.proyecto_investigacion_pedagogica === false || form.data.articulacion_eni === false) {
            form.data.grupo_investigacion_eni_id = null
            form.data.linea_investigacion_eni_id = null
            form.data.area_tematica_eni_id = null
        }
    }, [form.data.proyecto_investigacion_pedagogica, form.data.articulacion_eni])

    useEffect(() => {
        setArrayLineasInvestigacion([])

        setTimeout(() => {
            setArrayLineasInvestigacion(lineas_investigacion.filter((obj) => obj.centro_formacion_id === form.data.centro_formacion_id))
        }, 500)
    }, [form.data.centro_formacion_id])

    useEffect(() => {
        if (form.data.fecha_inicio && form.data.fecha_finalizacion) {
            form.setData((prevForm) => ({
                ...prevForm,
                max_meses_ejecucion: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
            }))
        }
    }, [form.data.fecha_inicio, form.data.fecha_finalizacion])

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-formulario-8-linea-66.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_formulario_8_linea_66.proyecto.allowed.to_update
            ? form.put(route('convocatorias.proyectos-formulario-8-linea-66.update', [convocatoria.id, proyecto_formulario_8_linea_66.id]), {
                  preserveScroll: true,
              })
            : null
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos-formulario-8-linea-66.updateLongColumn', [convocatoria.id, proyecto_formulario_8_linea_66?.proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <form onSubmit={submit}>
            <fieldset>
                <Grid container rowSpacing={20}>
                    <Grid item md={12}>
                        <div className="flex justify-around items-center bg-indigo-50 shadow rounded p-10">
                            <figure className="mr-8">
                                <img src="/images/projects.png" alt="" width={350} />
                            </figure>
                            <h1>
                                {method == 'PUT' ? (
                                    <>
                                        <strong>{proyecto_formulario_8_linea_66.titulo}</strong>
                                        <br />
                                        {proyecto_formulario_8_linea_66.proyecto.codigo}
                                    </>
                                ) : (
                                    <>Investigación aplicada y semilleros de investigación en centros de formación - Línea 66</>
                                )}
                            </h1>
                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <Label
                            required
                            labelFor="titulo"
                            className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
                            value="Título: Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)"
                        />
                        <Textarea
                            id="titulo"
                            className={`bg-transparent block border-0 mt-1 outline-none text-4xl text-center w-full`}
                            value={form.data.titulo}
                            onChange={(e) => form.setData('titulo', e.target.value)}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            required
                            onBlur={() => syncColumnLong('titulo', form)}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                    </Grid>
                    <Grid item md={6}>
                        <DatePicker
                            variant="outlined"
                            id="fecha_inicio"
                            minDate={convocatoria.year + '-01-01'}
                            maxDate={convocatoria.year + '-12-31'}
                            name="fecha_inicio"
                            value={form.data.fecha_inicio}
                            error={form.errors.fecha_inicio}
                            className="p-4 w-full"
                            onChange={(e) => (form.setData('fecha_inicio', e.target.value), syncColumnLong('fecha_inicio', form, e.target.value))}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                    </Grid>
                    <Grid item md={6}>
                        <DatePicker
                            variant="outlined"
                            id="fecha_finalizacion"
                            minDate={convocatoria.year + '-01-01'}
                            maxDate={convocatoria.year + '-12-31'}
                            name="fecha_finalizacion"
                            value={form.data.fecha_finalizacion}
                            error={form.errors.fecha_finalizacion}
                            className="p-4 w-full"
                            onChange={(e) => (form.setData('fecha_finalizacion', e.target.value), syncColumnLong('fecha_finalizacion', form, e.target.value))}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="centro_formacion_id" className="mb-4" value="Centro de formación" />
                    </Grid>
                    <Grid item md={6}>
                        {method == 'POST' || is_super_admin ? (
                            <Autocomplete
                                id="centro_formacion_id"
                                selectedValue={form.data.centro_formacion_id}
                                onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                options={
                                    centros_formacion ?? [
                                        { value: proyecto_formulario_8_linea_66.proyecto.centro_formacion.id, label: proyecto_formulario_8_linea_66.proyecto.centro_formacion.nombre },
                                    ]
                                }
                                disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                error={form.errors.centro_formacion_id}
                                onBlur={() => syncColumnLong('centro_formacion_id', form)}
                                required
                            />
                        ) : (
                            <>{proyecto_formulario_8_linea_66.proyecto.centro_formacion.nombre}</>
                        )}
                        <AlertMui> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </AlertMui>
                        {is_super_admin && (
                            <AlertMui className="mt-10" severity="error">
                                <strong className="mb-4 block">Importante:</strong>
                                Recuerde que si cambia el centro de formación y el formulador ya ha cargado soportes / anexos debe cambiar la ruta tanto en el sharepoint como en la base datos. Esta
                                debe ser la ruta asociada al proyecto:
                                <strong className=" mt-4 uppercase block">
                                    /Convocatoria {convocatoria.year}/{proyecto_formulario_8_linea_66?.proyecto.centro_formacion.nombre_carpeta_sharepoint}
                                </strong>
                            </AlertMui>
                        )}
                    </Grid>

                    {array_lineas_investigacion.length > 0 && (
                        <>
                            <Grid item md={6}>
                                <Label required labelFor="linea_investigacion_id" className="mb-4" value="Línea de investigación" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="linea_investigacion_id"
                                    selectedValue={form.data.linea_investigacion_id}
                                    onChange={(event, newValue) => form.setData('linea_investigacion_id', newValue.value)}
                                    disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                    options={array_lineas_investigacion}
                                    error={form.errors.linea_investigacion_id}
                                    onBlur={() => syncColumnLong('linea_investigacion_id', form)}
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item md={6}>
                        <Label required labelFor="areas_cualificacion_mnc" className="mb-4" value="Areas de Cualificación - Marco Nacional de Cualificaciones" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="areas_cualificacion_mnc"
                            bdValues={form.data.areas_cualificacion_mnc}
                            options={areas_cualificacion_mnc}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    areas_cualificacion_mnc: selected_values,
                                }))
                            }}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            error={form.errors.areas_cualificacion_mnc}
                            label="Seleccione una o varias opciones"
                            required
                            onBlur={() => syncColumnLong('areas_cualificacion_mnc', form)}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="red_conocimiento_id" className="mb-4" value="Red de conocimiento sectorial" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            id="red_conocimiento_id"
                            selectedValue={form.data.red_conocimiento_id}
                            onChange={(event, newValue) => form.setData('red_conocimiento_id', newValue.value)}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            options={redes_conocimiento}
                            error={form.errors.red_conocimiento_id}
                            onBlur={() => syncColumnLong('red_conocimiento_id', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="disciplina_subarea_conocimiento_id" className="mb-4" value="Disciplina de conocimiento" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            id="disciplina_subarea_conocimiento_id"
                            selectedValue={form.data.disciplina_subarea_conocimiento_id}
                            onChange={(event, newValue) => form.setData('disciplina_subarea_conocimiento_id', newValue.value)}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            options={disciplinas_subarea_conocimiento}
                            error={form.errors.disciplina_subarea_conocimiento_id}
                            onBlur={() => syncColumnLong('disciplina_subarea_conocimiento_id', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="actividad_economica_id" className="mb-4" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            id="actividad_economica_id"
                            selectedValue={form.data.actividad_economica_id}
                            onChange={(event, newValue) => form.setData('actividad_economica_id', newValue.value)}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            options={actividades_economicas}
                            error={form.errors.actividad_economica_id}
                            onBlur={() => syncColumnLong('actividad_economica_id', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="lineas_estrategicas_beneficiadas"
                            value="¿El proyecto aporta a la divulgación y apropiación del conocimiento relacionado con los retos que incorporan las líneas estratégicas de la Convocatoria?"
                        />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            className="mb-6"
                            id="lineas_estrategicas_beneficiadas"
                            bdValues={form.data.lineas_estrategicas_beneficiadas}
                            options={lineas_estrategicas}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    lineas_estrategicas_beneficiadas: selected_values,
                                }))
                            }}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            error={form.errors.lineas_estrategicas_beneficiadas}
                            label="Seleccione las líneas estrategicas"
                            onBlur={() => syncColumnLong('lineas_estrategicas_beneficiadas', form)}
                        />

                        <Textarea
                            label="Justificación"
                            id="justificacion_lineas_estrategicas_beneficiadas"
                            value={form.data.justificacion_lineas_estrategicas_beneficiadas}
                            onChange={(e) => form.setData('justificacion_lineas_estrategicas_beneficiadas', e.target.value)}
                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                            onBlur={() => syncColumnLong('justificacion_lineas_estrategicas_beneficiadas', form)}
                        />
                    </Grid>

                    {convocatoria.campos_convocatoria.filter((item) => item.campo == 'tematica_estrategica_id').find((item) => item.convocatoria_id == convocatoria.id) && (
                        <>
                            <Grid item md={6}>
                                <Label required labelFor="tematica_estrategica_id" className="mb-4" value="Temática estratégica SENA" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="tematica_estrategica_id"
                                    selectedValue={form.data.tematica_estrategica_id}
                                    onChange={(event, newValue) => form.setData('tematica_estrategica_id', newValue.value)}
                                    disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                    options={tematicas_estrategicas}
                                    error={form.errors.tematica_estrategica_id}
                                    onBlur={() => syncColumnLong('tematica_estrategica_id', form)}
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    {method == 'POST' && (
                        <>
                            <Grid item md={12}>
                                <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                            </Grid>

                            <Grid item md={6}>
                                <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="rol_sennova"
                                    selectedValue={form.data.rol_sennova}
                                    onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                    disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                    options={roles_sennova}
                                    label="Seleccione un rol SENNOVA"
                                    required
                                />
                            </Grid>

                            {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                                <>
                                    <Grid item md={6}>
                                        <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            type="number"
                                            id="cantidad_meses"
                                            inputProps={{
                                                step: 0.1,
                                                min: 1,
                                                max: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
                                            }}
                                            value={form.data.cantidad_meses}
                                            onChange={(e) => form.setData('cantidad_meses', e.target.value)}
                                            disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                            label="Número de meses de vinculación"
                                            required
                                        />
                                        {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                            <AlertMui>
                                                El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                                {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                            </AlertMui>
                                        )}
                                    </Grid>
                                </>
                            )}

                            <Grid item md={6}>
                                <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    type="number"
                                    id="cantidad_horas"
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                    }}
                                    value={form.data.cantidad_horas}
                                    onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                    disabled={!(proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update || allowed_to_create)}
                                    placeholder="Número de horas semanales dedicadas"
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    {method == 'PUT' && (
                        <>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="proyecto_investigacion_pedagogica" value="¿El proyecto es de investigación pedagógica?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    checked={form.data.proyecto_investigacion_pedagogica}
                                    onChange={(e) => form.setData('proyecto_investigacion_pedagogica', e.target.checked)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('proyecto_investigacion_pedagogica', form)}
                                />
                            </Grid>

                            {form.data.proyecto_investigacion_pedagogica && (
                                <>
                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="justificacion_proyecto_investigacion_pedagogica" value="Justificación" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Textarea
                                            id="justificacion_proyecto_investigacion_pedagogica"
                                            onChange={(e) => form.setData('justificacion_proyecto_investigacion_pedagogica', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.justificacion_proyecto_investigacion_pedagogica}
                                            value={form.data.justificacion_proyecto_investigacion_pedagogica}
                                            required
                                            onBlur={() => syncColumnLong('justificacion_proyecto_investigacion_pedagogica', form)}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="articulacion_eni" value="¿El proyecto está articulado con la ENI?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    checked={form.data.articulacion_eni}
                                    onChange={(e) => form.setData('articulacion_eni', e.target.checked)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('articulacion_eni', form)}
                                />
                            </Grid>

                            {form.data.articulacion_eni && (
                                <>
                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="grupo_investigacion_eni_id" value="Grupo de investigación ENI" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Autocomplete
                                            id="grupo_investigacion_eni_id"
                                            options={grupos_investigacion}
                                            selectedValue={form.data.grupo_investigacion_eni_id}
                                            onChange={(event, newValue) => {
                                                form.setData('grupo_investigacion_eni_id', newValue.value)
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.grupo_investigacion_eni_id}
                                            label="Seleccione un grupo de investigación"
                                            required
                                            onBlur={() => syncColumnLong('grupo_investigacion_eni_id', form)}
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="linea_investigacion_eni_id" value="Líneas de investigación ENI" />
                                    </Grid>

                                    <Grid item md={6}>
                                        <SelectMultiple
                                            id="linea_investigacion_eni_id"
                                            bdValues={form.data.linea_investigacion_eni_id}
                                            options={lineas_investigacion_eni}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    linea_investigacion_eni_id: selected_values,
                                                }))
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.linea_investigacion_eni_id}
                                            label="Seleccione una o varias opciones"
                                            required
                                            onBlur={() => syncColumnLong('linea_investigacion_eni_id', form)}
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="area_tematica_eni_id" value="Áreas temáticas" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <SelectMultiple
                                            id="area_tematica_eni_id"
                                            bdValues={form.data.area_tematica_eni_id}
                                            options={areas_tematicas_eni}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    area_tematica_eni_id: selected_values,
                                                }))
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.area_tematica_eni_id}
                                            label="Seleccione una o varias opciones"
                                            required
                                            onBlur={() => syncColumnLong('area_tematica_eni_id', form)}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={6}>
                                <Label labelFor="video" value="¿El proyecto tiene video?" />
                                <AlertMui className="mt-2 mr-4">
                                    Video de 3 minutos, en donde se presente de manera sencilla y dinámica la justificación del proyecto, la problemática, el objetivo general, los objetivos
                                    específicos, las actividades, los productos y su impacto en el marco del mecanismo de participación seleccionado como regional.
                                </AlertMui>
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={tiene_video}
                                    onChange={() => setTieneVideo(!tiene_video)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                />
                                {tiene_video && (
                                    <>
                                        <TextInput
                                            label="Link del video"
                                            id="video"
                                            type="url"
                                            error={form.errors.video}
                                            placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk"
                                            value={form.data.video}
                                            onChange={(e) => form.setData('video', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            onBlur={() => syncColumnLong('video', form)}
                                            required
                                        />
                                    </>
                                )}
                            </Grid>
                            <Grid item md={6}>
                                <Label required labelFor="relacionado_estrategia_campesena" value="¿El proyecto está relacionado con la estratégia institucional CAMPESENA?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={form.data.relacionado_estrategia_campesena}
                                    onChange={(e) => form.setData('relacionado_estrategia_campesena', e.target.checked)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('relacionado_estrategia_campesena', form)}
                                />

                                {form.data.relacionado_estrategia_campesena && (
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_relacion_campesena"
                                        onChange={(e) => form.setData('justificacion_relacion_campesena', e.target.value)}
                                        disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        error={form.errors.justificacion_relacion_campesena}
                                        value={form.data.justificacion_relacion_campesena}
                                        onBlur={() => syncColumnLong('justificacion_relacion_campesena', form)}
                                        required
                                    />
                                )}
                            </Grid>

                            <Grid item md={6}>
                                <Label required labelFor="impacto_regional" value="¿El proyecto tendrá impacto regional?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={form.data.impacto_regional}
                                    onChange={(e) => form.setData('impacto_regional', e.target.checked)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    onBlur={() => syncColumnLong('impacto_regional', form)}
                                />

                                {form.data.impacto_regional == 1 ? (
                                    <Textarea
                                        label="Justificación"
                                        id="justificacion_impacto_regional"
                                        onChange={(e) => form.setData('justificacion_impacto_regional', e.target.value)}
                                        disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        error={form.errors.justificacion_impacto_regional}
                                        value={form.data.justificacion_impacto_regional}
                                        onBlur={() => syncColumnLong('justificacion_impacto_regional', form)}
                                        required
                                    />
                                ) : null}
                            </Grid>
                            {convocatoria.campos_convocatoria.filter((item) => item.campo == 'justificacion_industria_4').find((item) => item.convocatoria_id == convocatoria.id) && (
                                <>
                                    <Grid item md={6}>
                                        <Label id="justificacion_industria_4" value="¿El proyecto está relacionado con la industria 4.0?" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <SwitchMui
                                            className="!mb-4"
                                            checked={requiere_justificacion_industria4}
                                            onChange={() => setRequiereJustificacionIndustria4(!requiere_justificacion_industria4)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        />
                                        {requiere_justificacion_industria4 && (
                                            <>
                                                <Textarea
                                                    label="Justificación"
                                                    id="justificacion_industria_4"
                                                    onChange={(e) => form.setData('justificacion_industria_4', e.target.value)}
                                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                    error={form.errors.justificacion_industria_4}
                                                    value={form.data.justificacion_industria_4}
                                                    onBlur={() => syncColumnLong('justificacion_industria_4', form)}
                                                    required
                                                />
                                                <AlertMui>Si el proyecto está relacionado con la industria 4.0 por favor realice la justificación.</AlertMui>
                                            </>
                                        )}
                                    </Grid>
                                </>
                            )}
                            {convocatoria.campos_convocatoria.filter((item) => item.campo == 'justificacion_economia_naranja').find((item) => item.convocatoria_id == convocatoria.id) && (
                                <>
                                    <Grid item md={6}>
                                        <Label labelFor="justificacion_economia_naranja" value="¿El proyecto está relacionado con la economía naranja?" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <SwitchMui
                                            className="!mb-4"
                                            checked={requiere_justificacion_economia_naranja}
                                            onChange={() => setRequiereJustificacionEconomiaNaranja(!requiere_justificacion_economia_naranja)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        />
                                        {requiere_justificacion_economia_naranja && (
                                            <>
                                                <Textarea
                                                    label="Justificación"
                                                    id="justificacion_economia_naranja"
                                                    onChange={(e) => form.setData('justificacion_economia_naranja', e.target.value)}
                                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                    error={form.errors.justificacion_economia_naranja}
                                                    value={form.data.justificacion_economia_naranja}
                                                    onBlur={() => syncColumnLong('justificacion_economia_naranja', form)}
                                                    required
                                                />
                                                <AlertMui>
                                                    Si el proyecto está relacionado con la economía naranja por favor realice la justificación. (Ver documento de apoyo: Guía Rápida SENA es NARANJA.)
                                                </AlertMui>
                                            </>
                                        )}
                                    </Grid>
                                </>
                            )}
                            <Grid item md={6}>
                                <Label labelFor="impacto_sector_agricola" value="¿El proyecto tendrá un impacto en el sector agrícola?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={requiere_justificacion_sector_agricola}
                                    onChange={() => setRequiereJustificacionSectorAgricola(!requiere_justificacion_sector_agricola)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                />

                                {requiere_justificacion_sector_agricola && (
                                    <Textarea
                                        label="Justificación"
                                        id="impacto_sector_agricola"
                                        onChange={(e) => form.setData('impacto_sector_agricola', e.target.value)}
                                        disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        error={form.errors.impacto_sector_agricola}
                                        value={form.data.impacto_sector_agricola}
                                        onBlur={() => syncColumnLong('impacto_sector_agricola', form)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={6}>
                                <Label labelFor="justificacion_politica_discapacidad" value="¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?" />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={requiere_justificacion_politica_discapacidad}
                                    onChange={() => setRequiereJustificacionPoliticaDiscapacidad(!requiere_justificacion_politica_discapacidad)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                />

                                {requiere_justificacion_politica_discapacidad && (
                                    <>
                                        <Textarea
                                            label="Justificación"
                                            id="justificacion_politica_discapacidad"
                                            onChange={(e) => form.setData('justificacion_politica_discapacidad', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.justificacion_politica_discapacidad}
                                            value={form.data.justificacion_politica_discapacidad}
                                            onBlur={() => syncColumnLong('justificacion_politica_discapacidad', form)}
                                            required
                                        />
                                        <AlertMui>
                                            Si el proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad por favor realice la justificación. RESOLUCIÓN 01726 DE
                                            2014 - Por la cual se adopta la Política Institucional para Atención de las Personas con discapacidad.
                                        </AlertMui>
                                    </>
                                )}
                            </Grid>
                            <Grid item md={6}>
                                <Label
                                    labelFor="atencion_pluralista_diferencial"
                                    value="¿El proyecto aporta a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)?"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <SwitchMui
                                    className="!mb-4"
                                    checked={requiere_justificacion_atencion_pluralista}
                                    onChange={() => setRequiereJustificacionAntencionPluralista(!requiere_justificacion_atencion_pluralista)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                />

                                {requiere_justificacion_atencion_pluralista && (
                                    <Textarea
                                        label="Justificación"
                                        id="atencion_pluralista_diferencial"
                                        error={form.errors.atencion_pluralista_diferencial}
                                        value={form.data.atencion_pluralista_diferencial}
                                        onChange={(e) => form.setData('atencion_pluralista_diferencial', e.target.value)}
                                        disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                        onBlur={() => syncColumnLong('atencion_pluralista_diferencial', form)}
                                        required
                                    />
                                )}
                            </Grid>
                            <Grid item md={12}>
                                <p className="text-center mb-8">
                                    ¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?
                                </p>
                                <AlertMui>
                                    Nota: Bioprospección se define como la exploración sistemática y sostenible de la biodiversidad para identificar y obtener nuevas fuentes de compuestos químicos,
                                    genes, proteínas, microorganismos y otros productos que tienen potencial de ser aprovechados comercialmente
                                </AlertMui>

                                <RadioGroup aria-labelledby="muestreo-radio-buttons-group-label" name="muestreo-radio-buttons-group">
                                    <div className="flex mt-20 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            value="1"
                                            error={form.errors.muestreo}
                                            checked={form.data.muestreo == '1'}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span>
                                            Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a
                                            aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no
                                            se encuentren en el país o migren a él como resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de
                                            domesticación incluyendo virus, viroides y similares)
                                        </span>
                                    </div>

                                    {form.data.muestreo == 1 && (
                                        <>
                                            <AlertMui>Ha seleccionado Especies Nativas. Por favor responda las siguientes preguntas:</AlertMui>
                                            <div className="flex mb-20">
                                                <div className="bg-gray-200 flex-1 p-8">
                                                    <div className="flex items-center">
                                                        <Label required className="mb-4" id="1.1" value="¿Qué actividad pretende realizar con la especie nativa?" />
                                                    </div>

                                                    <RadioGroup aria-labelledby="actividades-muestreo-radio-buttons-group-label" name="actividades-muestreo-radio-buttons-group">
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.1.1"
                                                                checked={form.data.actividades_muestreo == '1.1.1'}
                                                                onBlur={() => syncColumnLong('actividades_muestreo', form)}
                                                            />
                                                            <span>
                                                                Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza.
                                                            </span>
                                                        </div>
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.1.2"
                                                                checked={form.data.actividades_muestreo == '1.1.2'}
                                                                onBlur={() => syncColumnLong('actividades_muestreo', form)}
                                                            />
                                                            <span>
                                                                Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo.
                                                            </span>
                                                        </div>
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.1.3"
                                                                checked={form.data.actividades_muestreo == '1.1.3'}
                                                                onBlur={() => syncColumnLong('actividades_muestreo', form)}
                                                            />
                                                            <span> Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado. </span>
                                                        </div>
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('actividades_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.1.4"
                                                                checked={form.data.actividades_muestreo == '1.1.4'}
                                                                onBlur={() => syncColumnLong('actividades_muestreo', form)}
                                                            />
                                                            <span> No logro identificar la actividad a desarrollar con la especie nativa </span>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div className="bg-gray-300 flex-1 p-8">
                                                    <div className="flex items-center">
                                                        <Label required className="mb-4" id="1.2" value="¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?" />
                                                    </div>

                                                    <RadioGroup aria-labelledby="objetivo-muestreo-radio-buttons-group-label" name="objetivo-muestreo-radio-buttons-group">
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('objetivo_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.2.1"
                                                                checked={form.data.objetivo_muestreo == '1.2.1'}
                                                                onBlur={() => syncColumnLong('objetivo_muestreo', form)}
                                                            />
                                                            <span> Investigación básica sin fines comerciales </span>
                                                        </div>
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('objetivo_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.2.2"
                                                                checked={form.data.objetivo_muestreo == '1.2.2'}
                                                                onBlur={() => syncColumnLong('objetivo_muestreo', form)}
                                                            />
                                                            <span> Bioprospección en cualquiera de sus fases </span>
                                                        </div>
                                                        <div className="flex mt-4 items-center">
                                                            <RadioMui
                                                                onChange={(e) => form.setData('objetivo_muestreo', e.target.value)}
                                                                disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                                                value="1.2.3"
                                                                checked={form.data.objetivo_muestreo == '1.2.3'}
                                                                onBlur={() => syncColumnLong('objetivo_muestreo', form)}
                                                            />
                                                            <span> Comercial o Industrial </span>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex mt-4 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            value="2"
                                            checked={form.data.muestreo == '2'}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span> Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana) </span>
                                    </div>
                                    <div className="flex mt-4 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            value="3"
                                            checked={form.data.muestreo == '3'}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span> Recursos genéticos humanos y sus productos derivados </span>
                                    </div>
                                    <div className="flex mt-4 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            value="4"
                                            checked={form.data.muestreo == '4'}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span>
                                            Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que
                                            realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus
                                            prácticas consuetudinarias)
                                        </span>
                                    </div>
                                    <div className="flex mt-4 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            value="5"
                                            checked={form.data.muestreo == '5'}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span>
                                            Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso
                                            biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de
                                            investigación científica no comercial o provenga de una colección registrada ante el Instituto Alexander van Humboldt)
                                        </span>
                                    </div>
                                    <div className="flex mt-4 items-center">
                                        <RadioMui
                                            onChange={(e) => form.setData('muestreo', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            value="6"
                                            checked={form.data.muestreo == '6'}
                                            onBlur={() => syncColumnLong('muestreo', form)}
                                        />
                                        <span> No aplica </span>
                                    </div>
                                </RadioGroup>
                            </Grid>
                            <Grid item md={6}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="recoleccion_especimenes"
                                    value="En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica."
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="recoleccion_especimenes"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.recoleccion_especimenes}
                                    error={form.errors.recoleccion_especimenes}
                                    onChange={(event, newValue) => {
                                        form.setData('recoleccion_especimenes', newValue.value)
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    label="Seleccione una opción"
                                    required
                                    onBlur={() => syncColumnLong('recoleccion_especimenes', form)}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="relacionado_plan_tecnologico"
                                    value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="relacionado_plan_tecnologico"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.relacionado_plan_tecnologico}
                                    error={form.errors.relacionado_plan_tecnologico}
                                    onChange={(event, newValue) => {
                                        form.setData('relacionado_plan_tecnologico', newValue.value)
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    label="Seleccione una opción"
                                    required
                                    onBlur={() => syncColumnLong('relacionado_plan_tecnologico', form)}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="relacionado_agendas_competitividad"
                                    value="¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="relacionado_agendas_competitividad"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.relacionado_agendas_competitividad}
                                    error={form.errors.relacionado_agendas_competitividad}
                                    onChange={(event, newValue) => {
                                        form.setData('relacionado_agendas_competitividad', newValue.value)
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    label="Seleccione una opción"
                                    required
                                    onBlur={() => syncColumnLong('relacionado_agendas_competitividad', form)}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="relacionado_mesas_sectoriales"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.relacionado_mesas_sectoriales}
                                    error={form.errors.relacionado_mesas_sectoriales}
                                    onChange={(event, newValue) => {
                                        form.setData('relacionado_mesas_sectoriales', newValue.value)
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    label="Seleccione una opción"
                                    required
                                    onBlur={() => syncColumnLong('relacionado_mesas_sectoriales', form)}
                                />
                            </Grid>
                            {form.data.relacionado_mesas_sectoriales == 1 && (
                                <>
                                    <Grid item md={6}>
                                        <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                                    </Grid>
                                    <Grid item md={6}>
                                        <SelectMultiple
                                            className="mb-6"
                                            id="mesa_sectorial_id"
                                            bdValues={form.data.mesa_sectorial_id}
                                            options={mesas_sectoriales}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    mesa_sectorial_id: selected_values,
                                                }))
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.mesa_sectorial_id}
                                            label="Seleccione las mesas sectoriales"
                                            required
                                            onBlur={() => syncColumnLong('mesa_sectorial_id', form)}
                                        />

                                        <Textarea
                                            label="Justificación"
                                            id="justificacion_mesas_sectoriales"
                                            error={form.errors.justificacion_mesas_sectoriales}
                                            value={form.data.justificacion_mesas_sectoriales}
                                            onChange={(e) => form.setData('justificacion_mesas_sectoriales', e.target.value)}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            required
                                            onBlur={() => syncColumnLong('justificacion_mesas_sectoriales', form)}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="relacionado_tecnoacademia" value="¿El proyecto se formuló en conjunto con la tecnoacademia?" />
                            </Grid>
                            <Grid item md={6}>
                                <Autocomplete
                                    id="relacionado_tecnoacademia"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.relacionado_tecnoacademia}
                                    error={form.errors.relacionado_tecnoacademia}
                                    onChange={(event, newValue) => {
                                        form.setData('relacionado_tecnoacademia', newValue.value)
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    label="Seleccione una opción"
                                    required
                                    onBlur={() => syncColumnLong('relacionado_tecnoacademia', form)}
                                />
                            </Grid>
                            {form.data.relacionado_tecnoacademia == 1 && (
                                <>
                                    <Grid item md={6}>
                                        <p className="text-app-600">Por favor seleccione la Tecnoacademia con la cual articuló el proyecto</p>
                                    </Grid>

                                    <Grid item md={6}>
                                        <Autocomplete
                                            id="tecnoacademia_id"
                                            options={tecnoacademias}
                                            selectedValue={form.data.tecnoacademia_id}
                                            onChange={(event, newValue) => {
                                                form.setData('tecnoacademia_id', newValue.value)
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            required
                                        />
                                        <SelectMultiple
                                            className="mt-8"
                                            id="linea_tecnologica_id"
                                            bdValues={form.data.linea_tecnologica_id}
                                            options={array_lineas_tecnoacademia}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    linea_tecnologica_id: selected_values,
                                                }))
                                            }}
                                            disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                            error={form.errors.linea_tecnologica_id}
                                            label="Seleccione las líneas tecnológicas"
                                            required
                                            onBlur={() => syncColumnLong('linea_tecnologica_id', form)}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                                <AlertMui>
                                    Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree
                                    que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                                </AlertMui>
                                <Textarea
                                    id="resumen"
                                    value={form.data.resumen}
                                    onChange={(e) => form.setData('resumen', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('resumen', form)}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                                <AlertMui>
                                    Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de
                                    la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.
                                </AlertMui>
                                <Textarea
                                    id="antecedentes"
                                    error={form.errors.antecedentes}
                                    value={form.data.antecedentes}
                                    onChange={(e) => form.setData('antecedentes', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('antecedentes', form)}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                                <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>
                                <Textarea
                                    id="marco_conceptual"
                                    error={form.errors.marco_conceptual}
                                    value={form.data.marco_conceptual}
                                    onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('marco_conceptual', form)}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="numero_aprendices" value="Número de los aprendices que se beneficiarán en la ejecución del proyecto" />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    label="Número de aprendices"
                                    id="numero_aprendices"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                        max: 9999,
                                    }}
                                    error={form.errors.numero_aprendices}
                                    placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto"
                                    value={form.data.numero_aprendices}
                                    onChange={(e) => form.setData('numero_aprendices', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('numero_aprendices', form)}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                            </Grid>
                            <Grid item md={6}>
                                <SelectMultiple
                                    id="municipios"
                                    bdValues={form.data.municipios}
                                    options={municipios}
                                    isGroupable={true}
                                    groupBy={(option) => option.group}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            municipios: selected_values,
                                        }))
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    error={form.errors.municipios}
                                    label="Seleccionar municipios"
                                    required
                                    onBlur={() => syncColumnLong('municipios', form)}
                                />

                                <Tags
                                    id="veredas_corregimientos"
                                    className="mt-4"
                                    enforceWhitelist={false}
                                    tags={form.data.veredas_corregimientos}
                                    value={form.data.veredas_corregimientos}
                                    onChange={(e) => (form.setData('veredas_corregimientos', e.target.value), syncColumnLong('veredas_corregimientos', form, e.target.value))}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    placeholder="Nombres de las veredas o corregimientos"
                                    error={form.errors.veredas_corregimientos}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios, veradas o corregimientos" />

                                <Textarea
                                    id="impacto_municipios"
                                    error={form.errors.impacto_municipios}
                                    value={form.data.impacto_municipios}
                                    onChange={(e) => form.setData('impacto_municipios', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('impacto_municipios', form)}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con registro calificado a impactar" />
                            </Grid>
                            <Grid item md={6}>
                                <SelectMultiple
                                    id="programas_formacion"
                                    bdValues={form.data.programas_formacion}
                                    options={programas_formacion_con_registro_calificado}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            programas_formacion: selected_values,
                                        }))
                                    }}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    error={form.errors.programas_formacion}
                                    label="Seleccione los programas de formación"
                                    required
                                    onBlur={() => syncColumnLong('programas_formacion', form)}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />

                                <Textarea
                                    id="impacto_centro_formacion"
                                    error={form.errors.impacto_centro_formacion}
                                    value={form.data.impacto_centro_formacion}
                                    onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('impacto_centro_formacion', form)}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                                <AlertMui>
                                    Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición
                                    (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                                </AlertMui>

                                <Textarea
                                    id="bibliografia"
                                    error={form.errors.bibliografia}
                                    value={form.data.bibliografia}
                                    onChange={(e) => form.setData('bibliografia', e.target.value)}
                                    disabled={!proyecto_formulario_8_linea_66?.proyecto?.allowed?.to_update}
                                    required
                                    onBlur={() => syncColumnLong('bibliografia', form)}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </fieldset>

            {method == 'POST' || proyecto_formulario_8_linea_66.proyecto?.allowed?.to_update ? (
                <div className="flex items-center justify-between p-4">
                    <PrimaryButton type="submit" className="ml-auto" disabled={form.processing || !form.isDirty}>
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form
