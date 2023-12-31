import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        entidad_aliada_verificada: evaluacion.evaluacion_proyecto_linea66?.entidad_aliada_verificada,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.entidades-aliadas.verificar', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_70 = useForm({
        entidad_aliada_comentario: evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario ? evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario : '',
        entidad_aliada_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario == null ? true : false,
    })
    const submitEvaluacionLinea70 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_70.put(route('convocatorias.evaluaciones.entidades-aliadas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {proyecto.tipo_formulario_convocatoria_id == 7 ||
            proyecto.tipo_formulario_convocatoria_id == 9 ||
            proyecto.tipo_formulario_convocatoria_id == 1 ||
            proyecto.tipo_formulario_convocatoria_id == 8 ||
            proyecto.tipo_formulario_convocatoria_id == 6 ? (
                <>
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <AlertMui>
                        <form onSubmit={submitEvaluacionEstrategiaRegional}>
                            <div className="mt-4">
                                <p>
                                    Verifique que la información de la entidad o entidades aliadas registradas sea correcta. Luego seleccione una de las siguientes opciones:
                                    <br />
                                    ¿Las entidades aliadas son correctas? Por favor seleccione si Cumple o No cumple.
                                </p>
                                <SwitchMui
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    onChange={(e) => form_evaluacion_estrategia_regional.setData('entidad_aliada_verificada', e.target.checked)}
                                    checked={form_evaluacion_estrategia_regional.data.entidad_aliada_verificada}
                                />
                            </div>
                            {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                <div className="px-8 py-4 border-t border-gray-200 flex items-center sticky bottom-0">
                                    <PrimaryButton disabled={form_evaluacion_estrategia_regional.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </form>
                    </AlertMui>
                </>
            ) : proyecto.tipo_formulario_convocatoria_id == 4 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea70}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Las entidades aliadas son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        onChange={(e) => form_evaluacion_linea_70.setData('entidad_aliada_requiere_comentario', e.target.checked)}
                                        checked={form_evaluacion_linea_70.data.entidad_aliada_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.entidad_aliada_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="entidad_aliada_comentario"
                                            value={form_evaluacion_linea_70.data.entidad_aliada_comentario}
                                            onChange={(e) => form_evaluacion_linea_70.setData('entidad_aliada_comentario', e.target.value)}
                                            error={form_evaluacion_linea_70.errors.entidad_aliada_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_70.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Evaluacion
