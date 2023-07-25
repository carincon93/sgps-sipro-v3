import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, Grid, TableRow, TableCell } from '@mui/material'

import Form from './Form'

const Productos = ({ auth, convocatoria, proyecto, productos, validacionResultados, resultados, subtipologiasMinciencias, tiposProducto }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [productoToDestroy, setProductoToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [producto, setProducto] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Productos</h1>
                <p className="text-justify mb-10">
                    Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De
                    esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.
                </p>
                {validacionResultados && (
                    <AlertMui hiddenIcon={true} className="mt-10 mb-10">
                        {validacionResultados}
                    </AlertMui>
                )}

                {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            {evaluacion.idi_evaluacion ? (
                                                <p class="whitespace-pre-line text-xs">
                                                    {evaluacion.idi_evaluacion?.productos_comentario ? evaluacion.idi_evaluacion.productos_comentario : 'Sin recomendación'}
                                                </p>
                                            ) : evaluacion.cultura_innovacion_evaluacion ? (
                                                <p class="whitespace-pre-line text-xs">
                                                    {evaluacion.cultura_innovacion_evaluacion?.productos_comentario
                                                        ? evaluacion.cultura_innovacion_evaluacion.productos_comentario
                                                        : 'Sin recomendación'}
                                                </p>
                                            ) : (
                                                evaluacion.servicio_tecnologico_evaluacion && (
                                                    <>
                                                        <hr class="mt-10 mb-10 border-black-200" />
                                                        <h1 class="font-black">Productos</h1>

                                                        <ul class="list-disc pl-4">
                                                            <li class="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.productos_primer_obj_comentario
                                                                    ? 'Recomendación productos del primer objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.productos_primer_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li class="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.productos_segundo_obj_comentario
                                                                    ? 'Recomendación productos del segundo objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.productos_segundo_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li class="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.productos_tercer_obj_comentario
                                                                    ? 'Recomendación productos del tercer objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.productos_tercer_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                            <li class="whitespace-pre-line text-xs mb-10">
                                                                {evaluacion.servicio_tecnologico_evaluacion?.productos_cuarto_obj_comentario
                                                                    ? 'Recomendación productos del cuarto objetivo específico: ' +
                                                                      evaluacion.servicio_tecnologico_evaluacion.productos_cuarto_obj_comentario
                                                                    : 'Sin recomendación'}
                                                            </li>
                                                        </ul>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    }>
                                    Evaluación {i + 1}
                                </ToolTipMui>
                            ) : null,
                        )}
                        {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {isSuperAdmin ||
                checkRole(authUser, [5, 17]) ||
                (proyecto.allowed.to_update && validacionResultados == null && proyecto.modificable == true && proyecto.codigo_linea_programatica != 70) ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setProducto(null))} variant="raised">
                        Crear producto
                    </ButtonMui>
                ) : null}
            </Grid>

            <Grid item md={12}>
                {proyecto.codigo_linea_programatica == 70 && (
                    <AlertMui className="mt-20" hiddenIcon={true}>
                        Debe asociar las fechas y actividades a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Editar'.
                    </AlertMui>
                )}
                <TableMui className="mb-8" rows={['Descripción', 'Objetivo específico', 'Resultado/Meta', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {productos.data.map((producto, i) => (
                        <TableRow key={i}>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{producto.resultado.objetivo_especifico.descripcion}</TableCell>
                            <TableCell>
                                <>
                                    {proyecto.codigo_linea_programatica != 69 && proyecto.codigo_linea_programatica != 70 ? (
                                        <>Código {producto.resultado.id + '-' + producto.resultado.descripcion}</>
                                    ) : proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 ? (
                                        <>{producto.producto_ta_tp?.valor_proyectado}</>
                                    ) : null}
                                </>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {producto.id !== productoToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setProducto(producto))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProductoToDestroy(producto.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProductoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.productos.destroy', [convocatoria.id, proyecto.id, producto.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                }}>
                                                Confirmar
                                            </MenuItem>
                                        </div>
                                    )}
                                </MenuMui>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableMui>

                <PaginationMui links={productos.links} />

                <DialogMui
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            isSuperAdmin={isSuperAdmin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            convocatoria={convocatoria}
                            proyecto={proyecto}
                            producto={producto}
                            resultados={resultados}
                            subtipologiasMinciencias={subtipologiasMinciencias}
                            tiposProducto={tiposProducto}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Productos
