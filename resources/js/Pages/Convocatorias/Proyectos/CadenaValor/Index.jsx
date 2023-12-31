import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import Textarea from '@/Components/Textarea'
import PrimaryButton from '@/Components/PrimaryButton'
import StepperMui from '@/Components/Stepper'
import ToolTipMui from '@/Components/Tooltip'

import SwipeRightOutlinedIcon from '@mui/icons-material/SwipeRightOutlined'

import ScrollBooster from 'scrollbooster'

import { checkRole } from '@/Utils'
import { useEffect, useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import { Grid } from '@mui/material'

const CadenaValor = ({ auth, convocatoria, proyecto, evaluacion, objetivos, objetivo_general, productos, ...props }) => {
    const auth_user = auth.user
    const isSuperAdmin = checkRole(auth_user, [1])

    const form = useForm({
        propuesta_sostenibilidad: proyecto.propuesta_sostenibilidad,
        propuesta_sostenibilidad_social: proyecto.propuesta_sostenibilidad_social,
        propuesta_sostenibilidad_ambiental: proyecto.propuesta_sostenibilidad_ambiental,
        propuesta_sostenibilidad_financiera: proyecto.propuesta_sostenibilidad_financiera,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.propuesta-sostenibilidad', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.cadena-valor.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
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

    useEffect(() => {
        google.charts.setOnLoadCallback(drawChart)
    }, [])

    const drawChart = () => {
        var data = new google.visualization.DataTable()
        data.addColumn('string', 'Name')
        data.addColumn('string', 'Manager')
        data.addColumn('string', 'ToolTip')

        var options = {
            nodeClass: 'bg-app-500 text-white shadow',
            selectedNodeClass: 'bg-app-700',
            allowHtml: true,
            size: 'small',
        }

        // For each orgchart box, provide the name, manager, and tooltip to show.

        data.addRows([[{ v: 'Objetivo general', f: '<strong>Objetivo general</strong><div>' + objetivo_general?.substring(0, 250) + '...' + '</div>' }, '', 'Objetivo general']])

        objetivos.map((objetivo) => {
            data.addRows([
                [
                    {
                        v: 'Objetivo específico ' + objetivo.numero,
                        f:
                            '<strong>Objetivo específico ' + objetivo.numero + '</strong><div>' + objetivo.descripcion
                                ? objetivo.descripcion?.substring(0, 250) + '...'
                                : 'Sin descripción registrada aún' + '</div>',
                    },
                    'Objetivo general',
                    'Objetivo específico ' + objetivo.numero,
                ],
            ])
        })

        let totalProyecto = 0

        productos.map((producto) => {
            data.addRows([[{ v: producto.v, f: '<strong>Producto</strong><div>' + producto.f.substring(0, 250) + '...' + '</div>' }, producto.fkey, producto.tooltip]])
            producto.actividades.map((actividad) => {
                data.addRows([
                    [
                        {
                            v: 'act' + producto.v + actividad.id,
                            f:
                                '<strong>Actividad</strong><div>' +
                                actividad.descripcion.substring(0, 250) +
                                '...' +
                                '</div><div><strong>Roles:</strong><ul className="list-inside">' +
                                actividad.proyecto_roles_sennova.map((proyectoRol) => '<li>' + proyectoRol.convocatoria_rol_sennova.rol_sennova.nombre + '</li>') +
                                '</ul></div>',
                        },
                        producto.v,
                        actividad.descripcion,
                    ],
                ])
                totalProyecto += actividad.costo_actividad
                data.addRows([
                    [
                        {
                            v: 'cost' + producto.v + actividad.id,
                            f: '<strong>Costo</strong><div>$ ' + new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0) + ' COP</div>',
                        },
                        'act' + producto.v + actividad.id,
                        new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0),
                    ],
                ])
            })
        })

        // Create the chart.
        var chart = new google.visualization.OrgChart(document.getElementById('orgchart_div'))
        if (typeof chart.draw === 'function') {
            // Draw the chart, setting the allowHtml option to true for the tooltips.
            chart.draw(data, options)

            new ScrollBooster({
                viewport: document.getElementById('orgchart_div'),
                scrollMode: 'transform',
            })
        }

        console.log(totalProyecto)
    }

    return (
        <AuthenticatedLayout>
            <Head title="Cadena de valor" />

            <Grid item md={12} className="!mb-20">
                <StepperMui auth_user={auth_user} convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            {proyecto.tipo_formulario_convocatoria_id != 10 && proyecto.tipo_formulario_convocatoria_id != 17 && (
                <Grid item md={12}>
                    <h1 className="text-3xl mt-24 mb-8 text-center">Propuesta de sostenibilidad</h1>

                    {proyecto.tipo_formulario_convocatoria_id == 4 && (
                        <AlertMui className="text-center my-24">
                            A continuación, plantee las acciones concretas que contribuirán a la sostenibilidad financiera de la TecnoAcademia y su aporte a la sostenibilidad ambiental y social del
                            territorio.
                        </AlertMui>
                    )}

                    <form onSubmit={submit}>
                        <fieldset>
                            {proyecto.tipo_formulario_convocatoria_id != 4 ? (
                                <div>
                                    {proyecto.tipo_formulario_convocatoria_id == 12 ? (
                                        <AlertMui className="my-10">
                                            Se deben mencionar aquellos factores que pueden comprometer la viabilidad, desarrollo de los objetivos y resultados del proyecto a través del tiempo.
                                            <br />
                                            Para definir la propuesta de sostenibilidad se deben tener en cuenta los impactos definidos en el árbol de objetivos (ambiental, social - en el centro de
                                            formación, social - en el sector productivo, tecnológico)
                                        </AlertMui>
                                    ) : (
                                        <AlertMui className="my-10">
                                            Identificar los efectos que tiene el desarrollo del proyecto de investigación ya sea positivos o negativos. Se recomienda establecer las acciones
                                            pertinentes para mitigar los impactos negativos ambientales identificados y anexar el respectivo permiso ambiental cuando aplique. Tener en cuenta si aplica
                                            el decreto 1376 de 2013.
                                        </AlertMui>
                                    )}
                                    <Textarea
                                        label="Propuesta de sostenibilidad"
                                        id="propuesta_sostenibilidad"
                                        error={form.errors.propuesta_sostenibilidad}
                                        value={form.data.propuesta_sostenibilidad}
                                        onChange={(e) => form.setData('propuesta_sostenibilidad', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        onBlur={() => syncColumnLong('propuesta_sostenibilidad', form)}
                                        required
                                    />
                                </div>
                            ) : (
                                proyecto.tipo_formulario_convocatoria_id == 4 && (
                                    <>
                                        <div className="mt-8">
                                            <Textarea
                                                label="Propuesta de sostenibilidad social"
                                                id="propuesta_sostenibilidad_social"
                                                error={form.errors.propuesta_sostenibilidad_social}
                                                value={form.data.propuesta_sostenibilidad_social}
                                                onChange={(e) => form.setData('propuesta_sostenibilidad_social', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                onBlur={() => syncColumnLong('propuesta_sostenibilidad_social', form)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-8">
                                            <Textarea
                                                label="Propuesta de sostenibilidad ambiental"
                                                id="propuesta_sostenibilidad_ambiental"
                                                error={form.errors.propuesta_sostenibilidad_ambiental}
                                                value={form.data.propuesta_sostenibilidad_ambiental}
                                                onChange={(e) => form.setData('propuesta_sostenibilidad_ambiental', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                onBlur={() => syncColumnLong('propuesta_sostenibilidad_ambiental', form)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-8">
                                            <Textarea
                                                label="Propuesta de sostenibilidad financiera"
                                                id="propuesta_sostenibilidad_financiera"
                                                error={form.errors.propuesta_sostenibilidad_financiera}
                                                value={form.data.propuesta_sostenibilidad_financiera}
                                                onChange={(e) => form.setData('propuesta_sostenibilidad_financiera', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                onBlur={() => syncColumnLong('propuesta_sostenibilidad_financiera', form)}
                                                required
                                            />
                                        </div>
                                    </>
                                )
                            )}
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 py-4">
                            <small className="flex items-center text-app-700">{proyecto.updated_at}</small>
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Guardar propuesta de sostenibilidad
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </Grid>
            )}

            <Grid item md={12}>
                <hr className="mb-20 mt-20" />

                <h1 className="text-3xl m-24 text-center">Cadena de valor</h1>

                <AlertMui className="text-center my-10">
                    <SwipeRightOutlinedIcon className="!w-16 !h-16" />
                    <p>Para que pueda moverse fácilmente haga un clic sostenido sobre el gráfico de la cadena de valor y arrastre hacia cualquier dirección</p>
                </AlertMui>

                {productos.length == 0 && (
                    <AlertMui severity="error">
                        No ha generado productos por lo tanto tiene la cadena de valor incompleta.
                        <br />
                        Por favor realice los siguientes pasos:
                        <div>
                            1. Diríjase a <strong>Productos</strong> y genere los productos correspondientes
                        </div>
                        <div>
                            2. Luego diríjase a <strong>Actividades</strong> y asocie los productos y rubros correspondientes. De esta manera completa la cadena de valor.
                        </div>
                    </AlertMui>
                )}
                <div className="mt-10">
                    <div id="orgchart_div" className="overflow-hidden" style={{ margin: '0 -100px' }} />
                </div>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default CadenaValor
