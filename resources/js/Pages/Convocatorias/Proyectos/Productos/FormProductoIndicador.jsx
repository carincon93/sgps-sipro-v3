import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'

const FormProductoIndicador = ({ method = '', setDialogStatus, is_super_admin, convocatoria, proyecto, producto, resultados, subtipologias_minciencias, tipos_producto, ...props }) => {
    const form = useForm({
        nombre: producto?.nombre,
        resultado_id: producto?.resultado_id,
        fecha_inicio: producto?.fecha_inicio,
        fecha_finalizacion: producto?.fecha_finalizacion,

        indicador: producto?.indicador,
        medio_verificacion:
            producto?.producto_linea69?.medio_verificacion ??
            producto?.producto_linea68?.medio_verificacion ??
            producto?.producto_linea70?.medio_verificacion ??
            producto?.producto_linea83?.medio_verificacion ??
            '',

        nombre_indicador: producto?.producto_linea68?.nombre_indicador,
        formula_indicador: producto?.producto_linea68?.formula_indicador,
        meta_indicador: producto?.producto_linea68?.meta_indicador,

        valor_proyectado: producto?.producto_linea69?.valor_proyectado ?? producto?.producto_linea70?.valor_proyectado ?? producto?.producto_linea83?.valor_proyectado ?? '',
        actividad_id: producto?.actividades.map((item) => item.id),
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.productos.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.productos.update', [convocatoria.id, proyecto.id, producto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    const [actividades, setActividades] = useState([])
    useEffect(() => {
        if (resultados.find((item) => item.value == producto?.resultado_id)?.actividades) {
            const tmp_options_filtered = resultados
                .find((item) => item.value == producto?.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmp_options_filtered)
        }
    }, [producto])

    useEffect(() => {
        if (resultados.find((item) => item.value == form.data.resultado_id)?.actividades) {
            const tmp_options_filtered = resultados
                .find((item) => item.value == form.data.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmp_options_filtered)
        }
    }, [form.data.resultado_id])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10"> {method == 'crear' ? 'Agregar' : 'Modificar'} producto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <Grid container className="space-y-10">
                                <Grid item md={12}>
                                    {proyecto.codigo_linea_programatica == 70 && (
                                        <AlertMui>
                                            <p>
                                                <strong>Importante:</strong> Debe modifcar las fechas de ejecución, meta y las actividades a asociar.
                                            </p>
                                        </AlertMui>
                                    )}
                                </Grid>
                                <Grid item md={3}>
                                    <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                </Grid>
                                <Grid item md={9}>
                                    <DatePicker
                                        id="fecha_inicio"
                                        className="block w-full p-4"
                                        minDate={proyecto.fecha_inicio}
                                        maxDate={proyecto.fecha_finalizacion}
                                        value={form.data.fecha_inicio}
                                        onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                        error={form.errors.fecha_inicio}
                                        required
                                    />
                                </Grid>
                                <Grid item md={3}>
                                    <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                </Grid>
                                <Grid item md={9}>
                                    <DatePicker
                                        id="fecha_finalizacion"
                                        className="block w-full p-4"
                                        minDate={proyecto.fecha_inicio}
                                        maxDate={proyecto.fecha_finalizacion}
                                        value={form.data.fecha_finalizacion}
                                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                        error={form.errors.fecha_finalizacion}
                                        required
                                    />
                                </Grid>
                                <Grid item md={3}>
                                    <Label required labelFor="resultado_id" value="Resultado" />
                                </Grid>
                                <Grid item md={9}>
                                    <Autocomplete
                                        id="resultado_id"
                                        options={resultados}
                                        selectedValue={form.data.resultado_id}
                                        onChange={(event, newValue) => form.setData('resultado_id', newValue.value)}
                                        error={form.errors.resultado_id}
                                        label="Resultado"
                                        placeholder="Seleccione un resultado"
                                        disabled={proyecto.codigo_linea_programatica == 70 || !is_super_admin}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Textarea
                                        disabled={is_super_admin ? false : proyecto.codigo_linea_programatica == 70 ? true : false}
                                        label="Descripción"
                                        id="nombre"
                                        error={form.errors.nombre}
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        required
                                    />
                                    {proyecto.codigo_linea_programatica == 68 || proyecto.codigo_linea_programatica == 69 ? (
                                        <AlertMui>
                                            <p>
                                                Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una
                                                prestación intangible.
                                                <br />
                                                El producto debe cumplir con la siguiente estructura:
                                                <br />
                                                Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: Vía construida.
                                                <br />
                                                Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: Servicio de asistencia técnica para el mejoramiento de hábitos
                                                alimentarios
                                            </p>
                                        </AlertMui>
                                    ) : null}
                                </Grid>
                                {proyecto.codigo_linea_programatica != 68 && (
                                    <Grid item md={12}>
                                        <Textarea
                                            disabled={is_super_admin ? false : proyecto.codigo_linea_programatica == 70 ? true : false}
                                            id="indicador"
                                            error={form.errors.indicador}
                                            value={form.data.indicador}
                                            onChange={(e) => form.setData('indicador', e.target.value)}
                                            label="Indicador"
                                            required
                                        />

                                        {proyecto.codigo_linea_programatica != 70 && (
                                            <>
                                                {proyecto.codigo_linea_programatica == 69 ? (
                                                    <AlertMui>Deber ser medible y con una fórmula. Por ejemplo: (# metodologías validadas/# metodologías totales) X 100</AlertMui>
                                                ) : (
                                                    <AlertMui>Especifique los medios de verificación para validar los logros del proyecto.</AlertMui>
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                )}
                                {proyecto.codigo_linea_programatica == 68 ||
                                proyecto.codigo_linea_programatica == 69 ||
                                proyecto.codigo_linea_programatica == 70 ||
                                proyecto.codigo_linea_programatica == 83 ? (
                                    <>
                                        <Grid item md={12}>
                                            <Textarea
                                                disabled={is_super_admin ? false : proyecto.codigo_linea_programatica == 70 ? true : false}
                                                id="medio_verificacion"
                                                error={form.errors.medio_verificacion}
                                                value={form.data.medio_verificacion}
                                                onChange={(e) => form.setData('medio_verificacion', e.target.value)}
                                                label="Medio de verificación"
                                                required
                                            />
                                            {proyecto.codigo_linea_programatica != 70 && (
                                                <>
                                                    {proyecto.codigo_linea_programatica == 68 ? (
                                                        <AlertMui>
                                                            Los medios de verificación corresponden a las evidencias y/o fuentes de información en las que está disponibles los registros, la
                                                            información necesaria y suficiente. Dichos medios pueden ser documentos oficiales, informes, evaluaciones, encuestas, documentos o reportes
                                                            internos que genera el proyecto, entre otros.
                                                        </AlertMui>
                                                    ) : (
                                                        <AlertMui>Especifique los medios de verificación para validar los logros del objetivo específico.</AlertMui>
                                                    )}
                                                </>
                                            )}
                                        </Grid>
                                    </>
                                ) : null}
                                {proyecto.codigo_linea_programatica == 68 && (
                                    <>
                                        <Grid item md={12}>
                                            <Textarea
                                                id="nombre_indicador"
                                                error={form.errors.nombre_indicador}
                                                value={form.data.nombre_indicador}
                                                onChange={(e) => form.setData('nombre_indicador', e.target.value)}
                                                label="Nombre del Indicador del producto"
                                                required
                                            />
                                            <AlertMui>
                                                El indicador debe mantener una estructura coherente. Esta se compone de dos elementos: en primer lugar, debe ir el objeto a cuantificar, descrito por un
                                                sujeto y posteriormente la condición deseada, definida a través de un verbo en participio. Por ejemplo: Kilómetros de red vial nacional construidos.
                                            </AlertMui>
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                id="indicador"
                                                error={form.errors.indicador}
                                                value={form.data.indicador}
                                                onChange={(e) => form.setData('indicador', e.target.value)}
                                                label="Fórmula del Indicador del producto"
                                                required
                                            />
                                            <AlertMui>
                                                El método de cálculo debe ser una expresión matemática definida de manera adecuada y de fácil comprensión, es decir, deben quedar claras cuáles son las
                                                variables utilizadas. Los métodos de cálculo más comunes son el porcentaje, la tasa de variación, la razón y el número índice. Aunque éstos no son las
                                                únicas expresiones para los indicadores, sí son las más frecuentes.
                                            </AlertMui>
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                id="meta_indicador"
                                                error={form.errors.meta_indicador}
                                                value={form.data.meta_indicador}
                                                onChange={(e) => form.setData('meta_indicador', e.target.value)}
                                                label="Meta del indicador"
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}

                                {proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 83 ? (
                                    <Grid item md={12}>
                                        <Textarea
                                            label="Meta"
                                            id="valor_proyectado"
                                            error={form.errors.valor_proyectado}
                                            value={form.data.valor_proyectado}
                                            onChange={(e) => form.setData('valor_proyectado', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                ) : null}

                                <Grid item md={12}>
                                    <h6 className="mt-20 mb-12 text-2xl">Actividades a desarrollar</h6>
                                    <div className="bg-white rounded shadow overflow-hidden">
                                        <div className="p-4">
                                            <Label required className="mb-4" labelFor="actividad_id" value="Relacione las actividades respectivas" />
                                        </div>
                                        <div>
                                            {actividades?.length > 0 ? (
                                                <SelectMultiple
                                                    id="actividad_id"
                                                    bdValues={form.data.actividad_id}
                                                    options={actividades}
                                                    error={form.errors.actividad_id}
                                                    onChange={(event, newValue) => {
                                                        const selectedValues = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            actividad_id: selectedValues,
                                                        }))
                                                    }}
                                                    required
                                                />
                                            ) : (
                                                <AlertMui>
                                                    El resultado seleccionado no tiene actividades asociadas. Debe completar la información de cada actividad en el numeral de{' '}
                                                    <strong>Metodología y actividades</strong>. Para ello diríjase a la parte inferior de la ventanta, haga clic en los tres puntos de cada actividad |
                                                    Ver detalles. En el formulario que visualiza deberá completar el resto de información.
                                                </AlertMui>
                                            )}
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </fieldset>

                        {producto && <small className="inline-block my-10 text-app-700">{producto.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing || !form.isDirty} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Agregar' : 'Modificar'} producto
                                    </PrimaryButton>
                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                        Cancelar
                                    </ButtonMui>
                                </>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default FormProductoIndicador
