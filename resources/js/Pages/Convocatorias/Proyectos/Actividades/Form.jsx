import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import SelectMultiple from '@/Components/SelectMultiple'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'

const Form = ({ is_super_admin, method = '', setDialogStatus, convocatoria, proyecto, actividad, proyecto_presupuesto, proyecto_roles, productos, ...props }) => {
    const [resultados_filtrados, setResultadosFiltrados] = useState([])
    const [resultados_nulos, setResultadosNulos] = useState(false)

    const form = useForm({
        resultado_id: actividad?.resultado_id ?? '',
        descripcion: actividad?.descripcion ?? '',
        fecha_inicio: actividad?.fecha_inicio ?? '',
        fecha_finalizacion: actividad?.fecha_finalizacion ?? null,
        proyecto_rol_sennova_id: actividad.proyecto_roles_sennova.map((item) => item.id),
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.actividades.update', [convocatoria.id, proyecto.id, actividad.id]), {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            })
        }
    }

    useEffect(() => {
        const tmp_options_filtered = actividad.objetivo_especifico.resultados.map((option) => {
            const { id, descripcion } = option
            return { value: id, label: descripcion }
        })

        setResultadosFiltrados(tmp_options_filtered)

        if (!tmp_options_filtered?.some((item) => item.label == null)) {
            setResultadosNulos(true)
        }
    }, [actividad])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Modificar actividad</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={10}>
                                <Grid item md={6}>
                                    <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                </Grid>
                                <Grid item md={6}>
                                    <DatePicker
                                        id="fecha_inicio"
                                        className="mt-1 block w-full p-4"
                                        minDate={proyecto.fecha_inicio}
                                        maxDate={proyecto.fecha_finalizacion}
                                        value={form.data.fecha_inicio}
                                        onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.fecha_inicio}
                                        required
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                </Grid>
                                <Grid item md={6}>
                                    <DatePicker
                                        id="fecha_finalizacion"
                                        className="mt-1 block w-full p-4"
                                        minDate={proyecto.fecha_inicio}
                                        maxDate={proyecto.fecha_finalizacion}
                                        value={form.data.fecha_finalizacion}
                                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.fecha_finalizacion}
                                        required
                                    />
                                </Grid>
                                {resultados_filtrados.length > 0 && resultados_nulos == true ? (
                                    <>
                                        <Grid item md={6}>
                                            <Label required labelFor="resultado_id" value="Resultado asociado" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <Autocomplete
                                                id="resultado_id"
                                                options={resultados_filtrados}
                                                selectedValue={form.data.resultado_id}
                                                error={form.errors.resultado_id}
                                                onChange={(event, newValue) => form.setData('resultado_id', newValue.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                placeholder="Seleccione un resultado"
                                                required
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <AlertMui className="mt-5" severity="error">
                                        No puede completar la información de las actividades hasta que no estén todos los resultados con la información completa. Por favor complete la información de
                                        los resultados en el paso de <strong>Objetivos, resultados, impactos y actividades.</strong>
                                    </AlertMui>
                                )}
                                <Grid item md={12}>
                                    <Textarea
                                        label="Descripción"
                                        id="descripcion"
                                        error={form.errors.descripcion}
                                        value={form.data.descripcion}
                                        onChange={(e) => form.setData('descripcion', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </Grid>

                                {proyecto.tipo_formulario_convocatoria_id != 7 && proyecto.tipo_formulario_convocatoria_id != 9 && proyecto?.tipo_formulario_convocatoria_id != 1 ? (
                                    <Grid item md={12}>
                                        <h6 className="mb-10 text-2xl">Roles responsables</h6>
                                        <SelectMultiple
                                            id="proyecto_rol_sennova_id"
                                            bdValues={form.data.proyecto_rol_sennova_id}
                                            options={proyecto_roles}
                                            error={form.errors.proyecto_rol_sennova_id}
                                            label="Relacione los roles responsables"
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    proyecto_rol_sennova_id: selected_values,
                                                }))
                                            }}
                                            disabled={!proyecto?.allowed?.to_update}
                                        />
                                    </Grid>
                                ) : null}
                            </Grid>
                        </fieldset>

                        {actividad && <small className="my-10 inline-block text-app-700">{actividad.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing || !form.isDirty} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} actividad
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form
