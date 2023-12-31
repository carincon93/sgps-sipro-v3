import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'
import { checkRole } from '@/Utils'

import { useForm, usePage } from '@inertiajs/react'
import { Divider, Grid } from '@mui/material'

import React, { useEffect, useState } from 'react'

const Evaluacion = ({ auth_user, convocatoria, evaluacion, allowed, proyecto, setDialogEvaluacionStatus, ...props }) => {
    const { props: page_props } = usePage()

    const evaluacion_id = page_props.ziggy.query.evaluacion_id

    const form = useForm({
        evaluacion_id: evaluacion_id,
        clausula_confidencialidad: evaluacion[0]?.clausula_confidencialidad,
    })

    useEffect(() => {
        const evaluaciones_flattened = evaluacion.reduce((acc, item) => {
            Object.keys(item).forEach((key) => {
                acc[key] = item[key]
            })
            return acc
        }, {})

        form.setData({ ...evaluaciones_flattened, ...form.data })
    }, [])

    const submit = (e) => {
        e.preventDefault()

        putEvaluacion()
    }

    const putEvaluacion = () => {
        if (form.data.allowed.to_update) {
            form.put(route('convocatorias.evaluaciones-formulario-12-linea-68.update', [convocatoria.id, evaluacion_id]), {
                onSuccess: () => setDialogEvaluacionStatus(false),
                preserveScroll: true,
            })
        }
    }

    useEffect(() => {
        if (!evaluacion[0]?.clausula_confidencialidad && form.data.clausula_confidencialidad) {
            putEvaluacion()
        }
    }, [form.data.clausula_confidencialidad])

    const [evaluacion_rol_sennova, setEvaluacionRolSennova] = useState(null)
    const [dialog_evaluacion_rol_status, setDialogEvaluacionRolStatus] = useState(false)
    const form_evaluacion_rol = useForm({
        correcto: evaluacion_rol_sennova?.comentario == null ? true : false,
        comentario: evaluacion_rol_sennova?.comentario ? evaluacion_rol_sennova?.comentario : '',
    })

    useEffect(() => {
        if (evaluacion_rol_sennova) {
            const evaluacion_rol_sennova_seleccionado = evaluacion_rol_sennova.proyecto_roles_evaluaciones?.find((evaluacion_rol) => evaluacion_rol.evaluacion_id == evaluacion_id)
            if (evaluacion_rol_sennova_seleccionado) {
                form_evaluacion_rol.setData({ correcto: evaluacion_rol_sennova_seleccionado.correcto, comentario: evaluacion_rol_sennova_seleccionado.comentario })
            }
        }
    }, [evaluacion_rol_sennova])

    const submitEvaluacionRol = (e) => {
        e.preventDefault()

        form_evaluacion_rol.put(route('convocatorias.evaluaciones.proyecto-rol-sennova.update', [convocatoria.id, evaluacion_id, evaluacion_rol_sennova.id]), {
            onSuccess: () => setDialogEvaluacionRolStatus(false),
            preserveScroll: true,
        })
    }

    const [evaluacion_rubro, setEvaluacionRubro] = useState(null)
    const [dialog_evaluacion_rubro_status, setDialogEvaluacionRubroStatus] = useState(false)
    const form_evaluacion_rubro = useForm({
        correcto: evaluacion_rubro?.comentario == null ? true : false,
        comentario: evaluacion_rubro?.comentario ? evaluacion_rubro?.comentario : '',
    })

    useEffect(() => {
        if (evaluacion_rubro) {
            const evaluacion_rubro_seleccionado = evaluacion_rubro.proyecto_presupuestos_evaluaciones?.find((evaluacion_rubro) => evaluacion_rubro.evaluacion_id == evaluacion_id)
            if (evaluacion_rubro_seleccionado) {
                form_evaluacion_rubro.setData({ correcto: evaluacion_rubro_seleccionado.correcto, comentario: evaluacion_rubro_seleccionado.comentario })
            }
        }
    }, [evaluacion_rubro])

    const submitEvaluacionRubro = (e) => {
        e.preventDefault()

        form_evaluacion_rubro.put(route('convocatorias.evaluaciones.presupuesto.update', [convocatoria.id, evaluacion_id, evaluacion_rubro.id]), {
            onSuccess: () => setDialogEvaluacionRubroStatus(false),
            preserveScroll: true,
        })
    }

    const evaluacion_finalizada = evaluacion[0]?.finalizado

    return (
        <>
            <DialogMui
                open={!evaluacion[0]?.clausula_confidencialidad && !checkRole(auth_user, [1, 5, 17, 18, 19, 20])}
                dialogContent={
                    <div>
                        <Divider className="!mb-6 font-black">CLÁUSULA DE CONFIDENCIALIDAD</Divider>

                        <AlertMui severity={form.data.clausula_confidencialidad ? 'success' : 'error'}>
                            Para poder evaluar debe aceptar la cláusula de confidencialidad
                            <br />
                            <Checkbox
                                className="mt-8"
                                name="clausula_confidencialidad"
                                checked={form.data.clausula_confidencialidad}
                                error={form.errors.clausula_confidencialidad}
                                onChange={(e) => form.setData('clausula_confidencialidad', e.target.checked)}
                                disabled={evaluacion_finalizada}
                                label={form.data.clausula_confidencialidad ? 'He aceptado la cláusula de confidencialidad' : 'Acepto la cláusula de confidencialidad'}
                            />
                        </AlertMui>
                    </div>
                }
            />
            <form onSubmit={submit} className="space-y-10" id="form-evaluacion">
                {evaluacion.map((evaluacion, i) => (
                    <div key={i}>
                        <Divider className="!my-20" />

                        <h1 className="font-black uppercase my-4">{evaluacion['campo_pregunta_id_' + evaluacion.pregunta_id]}</h1>

                        {evaluacion['puntaje_maximo_pregunta_id_' + evaluacion.pregunta_id] && (
                            <>
                                <Label
                                    className="!mb-6"
                                    labelFor={evaluacion['campo_pregunta_id_' + evaluacion.pregunta_id]}
                                    value={`Puntaje (Máximo ${evaluacion['puntaje_maximo_pregunta_id_' + evaluacion.pregunta_id]})`}
                                />
                                <TextInput
                                    label="Diligencie el puntaje"
                                    id={evaluacion['campo_pregunta_id_' + evaluacion.pregunta_id]}
                                    type="number"
                                    inputBackground="#fff"
                                    inputProps={{
                                        step: 0.1,
                                        min: 0,
                                        max: evaluacion['puntaje_maximo_pregunta_id_' + evaluacion.pregunta_id],
                                    }}
                                    onChange={(e) => form.setData('form_puntaje_pregunta_id_' + evaluacion.pregunta_id, e.target.value)}
                                    value={form.data['form_puntaje_pregunta_id_' + evaluacion.pregunta_id]}
                                    error={form.errors['form_puntaje_pregunta_id_' + evaluacion.pregunta_id]}
                                    disabled={evaluacion_finalizada}
                                    placeholder="Puntaje"
                                />
                            </>
                        )}

                        {evaluacion['criterio_pregunta_id_' + evaluacion.pregunta_id] && (
                            <AlertMui>
                                <h1>Criterios de evaluacion / Comentario</h1>
                                <p className="whitespace-pre-line mt-6">{evaluacion['criterio_pregunta_id_' + evaluacion.pregunta_id]}</p>
                            </AlertMui>
                        )}

                        <div className="mt-10">
                            <p>
                                Si considera que la información del ítem <strong className="uppercase">{evaluacion['campo_pregunta_id_' + evaluacion.pregunta_id]}</strong> puede mejorarse, por favor
                                seleccione <strong>SI</strong> y haga la respectiva recomendación.
                            </p>
                            <p className="!mt-6 font-black">¿Debe mejorarse el ítem?</p>
                            <SwitchMui
                                checked={form.data['form_requiere_comentario_pregunta_id_' + evaluacion.pregunta_id]}
                                onChange={(e) => form.setData('form_requiere_comentario_pregunta_id_' + evaluacion.pregunta_id, e.target.checked)}
                                disabled={evaluacion_finalizada}
                            />

                            {form.data['form_requiere_comentario_pregunta_id_' + evaluacion.pregunta_id] && (
                                <Textarea
                                    label="Comentario"
                                    className="!mt-4"
                                    inputBackground="#fff"
                                    id={'form_comentario_pregunta_id_' + evaluacion.pregunta_id}
                                    onChange={(e) => form.setData('form_comentario_pregunta_id_' + evaluacion.pregunta_id, e.target.value)}
                                    value={form.data['form_comentario_pregunta_id_' + evaluacion.pregunta_id]}
                                    error={form.errors['form_comentario_pregunta_id_' + evaluacion.pregunta_id]}
                                    disabled={evaluacion_finalizada}
                                    required
                                />
                            )}
                        </div>
                    </div>
                ))}
            </form>

            <Divider className="!my-20 font-black">ROLES</Divider>
            <Grid container rowSpacing={2}>
                {proyecto.proyecto_roles_sennova.map((rol_sennova, i) => (
                    <Grid item md={3} key={i}>
                        <ButtonMui onClick={() => (form_evaluacion_rol.reset(), setDialogEvaluacionRolStatus(true), setEvaluacionRolSennova(rol_sennova))}>
                            Evaluar rol con código #{rol_sennova.id}
                        </ButtonMui>
                    </Grid>
                ))}

                {proyecto.proyecto_roles_sennova.length == 0 && <AlertMui severity="error">No hay ítems para evaluar</AlertMui>}
            </Grid>

            <Divider className="!my-20 font-black">RUBROS PRESUPUESTALES</Divider>
            <Grid container rowSpacing={2}>
                {proyecto.proyecto_presupuesto.map((rubro, i) => (
                    <Grid item md={3} key={i}>
                        <ButtonMui onClick={() => (form_evaluacion_rubro.reset(), setDialogEvaluacionRubroStatus(true), setEvaluacionRubro(rubro))}>
                            Evaluar rubro presupuestal con código #{rubro.id}
                        </ButtonMui>
                    </Grid>
                ))}

                {proyecto.proyecto_presupuesto.length == 0 && <AlertMui severity="error">No hay ítems para evaluar</AlertMui>}
            </Grid>

            <DialogMui
                open={dialog_evaluacion_rol_status}
                dialogContent={
                    <form onSubmit={submitEvaluacionRol}>
                        <Divider className="!mb-20 font-black">ROL - CÓDIGO #{evaluacion_rol_sennova?.id}</Divider>

                        <p>
                            Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                            <br />
                            <br />
                            ¿El rol es correcto?
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form_evaluacion_rol.data.correcto}
                            onChange={(e) => form_evaluacion_rol.setData('correcto', e.target.checked)}
                            disabled={evaluacion_finalizada}
                        />
                        {form_evaluacion_rol.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="!mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rol.data.comentario}
                                error={form_evaluacion_rol.errors.comentario}
                                onChange={(e) => form_evaluacion_rol.setData('comentario', e.target.value)}
                                disabled={evaluacion_finalizada}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRolStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>
                            {!evaluacion_finalizada && (
                                <PrimaryButton disabled={form_evaluacion_rol.processing} type="submit">
                                    Guardar
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                }
            />

            <DialogMui
                open={dialog_evaluacion_rubro_status}
                dialogContent={
                    <form onSubmit={submitEvaluacionRubro}>
                        <Divider className="!mb-20 font-black">RUBRO PRESUPUESTAL - CÓDIGO #{evaluacion_rubro?.id}</Divider>

                        <p>
                            Si considera que la información puede mejorarse, por favor seleccione <strong>NO</strong> y haga la respectiva recomendación.
                            <br />
                            <br />
                            ¿El rubro es correcto?
                        </p>
                        <SwitchMui
                            className="!my-6"
                            checked={form_evaluacion_rubro.data.correcto}
                            onChange={(e) => form_evaluacion_rubro.setData('correcto', e.target.checked)}
                            disabled={evaluacion_finalizada}
                        />
                        {form_evaluacion_rubro.data.correcto == false && (
                            <Textarea
                                label="Comentario"
                                className="mt-4"
                                inputBackground="#fff"
                                id="comentario"
                                value={form_evaluacion_rubro.data.comentario}
                                error={form_evaluacion_rubro.errors.comentario}
                                onChange={(e) => form_evaluacion_rubro.setData('comentario', e.target.value)}
                                disabled={evaluacion_finalizada}
                                required
                            />
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <ButtonMui onClick={() => setDialogEvaluacionRubroStatus(false)} className="!bg-transparent !text-app-700 !mr-2">
                                Cerrar
                            </ButtonMui>
                            {!evaluacion_finalizada && (
                                <PrimaryButton disabled={form_evaluacion_rubro.processing} type="submit">
                                    Guardar
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                }
            />
        </>
    )
}

export default Evaluacion
