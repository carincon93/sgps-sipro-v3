import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'
import SelectMultiple from '@/Components/SelectMultiple'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import AlertMui from '@/Components/Alert'

const Form = ({
    method = '',
    setDialogStatus,
    convocatoria,
    proyecto,
    presupuesto,
    municipio_a_visitar,
    municipios,
    proyecto_roles_sennova,
    distancias_municipios,
    frecuencias_semanales,
    ...props
}) => {
    const form = useForm({
        proyecto_rol_sennova_id: municipio_a_visitar?.proyecto_rol_sennova_id ?? '',
        actividad_a_realizar: municipio_a_visitar?.actividad_a_realizar ?? '',
        municipios: municipio_a_visitar?.municipios ?? null,
        distancia_municipio: municipio_a_visitar?.distancia_municipio ?? '',
        frecuencia_semanal: municipio_a_visitar?.frecuencia_semanal ?? '',
        numero_visitas: municipio_a_visitar?.numero_visitas ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.presupuesto.municipios.store', [convocatoria.id, proyecto.id, presupuesto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.municipios.update', [convocatoria.id, proyecto.id, presupuesto.id, municipio_a_visitar.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} municipio</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={8}>
                                <Grid item md={12}>
                                    {proyecto_roles_sennova.length > 0 ? (
                                        <Autocomplete
                                            id="proyecto_rol_sennova_id"
                                            options={proyecto_roles_sennova}
                                            selectedValue={form.data.proyecto_rol_sennova_id}
                                            onChange={(event, newValue) => form.setData('proyecto_rol_sennova_id', newValue.value)}
                                            disabled={!proyecto?.allowed?.to_update}
                                            error={form.errors.proyecto_rol_sennova_id}
                                            label="Rol"
                                            required
                                        />
                                    ) : (
                                        <AlertMui error={true}>No puede agregar municipios hasta que no haya definido los roles a contratar</AlertMui>
                                    )}
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        id="actividad_a_realizar"
                                        error={form.errors.actividad_a_realizar}
                                        value={form.data.actividad_a_realizar}
                                        onChange={(e) => form.setData('actividad_a_realizar', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        label="Actividades a realizar"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
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
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.municipios}
                                        label="Municipios a visitar"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Autocomplete
                                        id="distancia_municipio"
                                        options={distancias_municipios}
                                        selectedValue={form.data.distancia_municipio}
                                        onChange={(event, newValue) => form.setData('distancia_municipio', newValue.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.distancia_municipio}
                                        label="Distancia municipio"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Autocomplete
                                        id="frecuencia_semanal"
                                        options={frecuencias_semanales}
                                        selectedValue={form.data.frecuencia_semanal}
                                        onChange={(event, newValue) => form.setData('frecuencia_semanal', newValue.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.frecuencia_semanal}
                                        label="Frecuencia semanal de visita"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="numero_visitas"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        error={form.errors.numero_visitas}
                                        value={form.data.numero_visitas}
                                        onChange={(e) => form.setData('numero_visitas', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        label="Número de visitas"
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </fieldset>

                        {municipio_a_visitar && <small className="flex items-center my-14 text-app-700">{municipio_a_visitar.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} municipio
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
