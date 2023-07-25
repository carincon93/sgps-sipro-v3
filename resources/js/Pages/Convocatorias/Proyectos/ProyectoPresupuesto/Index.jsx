import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import Pagination from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { Link, router } from '@inertiajs/react'
import { useState } from 'react'

import { route, checkRole } from '@/Utils'

import Form from './Form'
import React from 'react'

const RubrosPresupuestales = ({
    auth,
    convocatoria,
    proyecto,
    rubrosPresupuestales,
    segundoGrupoPresupuestal,
    tercerGrupoPresupuestal,
    usosPresupuestales,
    tiposLicencia,
    tiposSoftware,
    opcionesServiciosEdicion,
    conceptosViaticos,
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [rubroPresupuestal, setRubroPresupuestal] = useState(null)
    const [rubroPresupuestalToDestroy, setRubroPresupuestalToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12}>
                <h1 className="mt-24 mb-8 text-center text-3xl">Rubros presupuestales</h1>

                {proyecto.allowed.to_update && (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setRubroPresupuestal(null))} variant="raised">
                        Añadir rubro presupuestal
                    </ButtonMui>
                )}
            </Grid>

            <Grid item md={12}>
                <AlertMui hiddenIcon={true} className="mt-20">
                    <strong>Actualmente el total del costo de los productos o servicios requeridos es de:</strong> $
                    {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_proyecto_presupuesto) ? proyecto.total_proyecto_presupuesto : 0)} COP
                </AlertMui>
                <TableMui
                    className="mb-8"
                    rows={['Descripción del bien o servicio', 'Subtotal del costo de los productos o servicios requeridos', 'Evaluación', 'Acciones']}
                    sxCellThead={{ width: '320px' }}>
                    {rubrosPresupuestales.data.map((presupuesto, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex flex-col focus:text-app-500 px-6 py-4" id={`PRE-${presupuesto.id}`}>
                                    <small>Código: PRE-{presupuesto.id}</small>
                                    <div className="mt-3">
                                        <p className="whitespace-pre-line line-clamp-6">{presupuesto.descripcion}</p>
                                    </div>

                                    <div className="mt-3">
                                        <small className="underline">Usos presupuestales</small>
                                        <ul className="list-disc ml-4">
                                            {presupuesto.convocatoria_proyecto_rubros_presupuestales.map((convocatoriaRubroPresupuestal, i) => (
                                                <li key={i}>
                                                    <p className="first-letter:uppercase mb-2">
                                                        {convocatoriaRubroPresupuestal.presupuesto_sennova.uso_presupuestal.descripcion}{' '}
                                                        {convocatoriaRubroPresupuestal.sumar_al_presupuesto ? null : (
                                                            <Chip label="No suma al presupuesto" size="small" className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-1" />
                                                        )}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP</div>
                                {presupuesto.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado ? (
                                    <Link
                                        href={route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                        className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                        <FolderSharedIcon className=" !mr-2" />
                                        Debe cargar los estudios de mercado
                                    </Link>
                                ) : (
                                    <Chip
                                        icon={<InfoOutlinedIcon className="!text-blue-500 !ml-2" />}
                                        label="No requiere de estudios de mercado"
                                        className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-4"
                                    />
                                )}

                                {proyecto.codigo_linea_programatica == 70 && (
                                    <>
                                        {usosPresupuestales
                                            .filter((item1) => presupuesto?.convocatoria_proyecto_rubros_presupuestales?.some((item2) => item2.id == item1.value))
                                            .map((item) => item.codigo_uso_presupuestal)
                                            .includes('20202008005096') && (
                                            <Link
                                                href={route('convocatorias.proyectos.presupuesto.edt.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                                className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                                <CelebrationOutlinedIcon className="!mr-2" />
                                                Debe generar los respectivos EDTs
                                            </Link>
                                        )}
                                    </>
                                )}

                                {presupuesto.convocatoria_proyecto_rubros_presupuestales.map((rubroPresupuestal, i) => (
                                    <React.Fragment key={i}>
                                        {rubroPresupuestal.presupuesto_sennova.segundo_grupo_presupuestal.codigo == '2041102' ||
                                        rubroPresupuestal.presupuesto_sennova.segundo_grupo_presupuestal.codigo == '2041101' ||
                                        rubroPresupuestal.presupuesto_sennova.segundo_grupo_presupuestal.codigo == '2041104' ? (
                                            <Link
                                                href={route('convocatorias.proyectos.presupuesto.municipios.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                                className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                                <AirplaneTicketIcon className="mr-2" />
                                                Debe relacionar los municipios a visitar
                                            </Link>
                                        ) : null}
                                    </React.Fragment>
                                ))}
                            </TableCell>
                            <TableCell>
                                {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                                    <>
                                        {presupuesto.proyecto_presupuestos_evaluaciones.map((evaluacion, i) =>
                                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                <ToolTipMui
                                                    key={i}
                                                    title={
                                                        <div>
                                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                            {evaluacion.correcto == false && evaluacion.evaluacion.habilitado ? (
                                                                <>{evaluacion.comentario ? evaluacion.comentario : 'Sin recomendación'}</>
                                                            ) : (
                                                                <>Aprobado</>
                                                            )}
                                                        </div>
                                                    }>
                                                    Evaluación {i + 1}
                                                </ToolTipMui>
                                            ) : null,
                                        )}
                                        {presupuesto.proyecto_presupuestos_evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El ítem no ha sido evaluado aún.</p> : null}
                                    </>
                                ) : null}
                            </TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {presupuesto.id !== rubroPresupuestalToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setRubroPresupuestal(presupuesto))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setRubroPresupuestalToDestroy(presupuesto.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setRubroPresupuestalToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.presupuesto.destroy', [convocatoria.id, proyecto.id, presupuesto.id]), {
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

                <Pagination links={rubrosPresupuestales.links} />

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
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            rubroPresupuestal={rubroPresupuestal}
                            tiposLicencia={tiposLicencia}
                            tiposSoftware={tiposSoftware}
                            opcionesServiciosEdicion={opcionesServiciosEdicion}
                            segundoGrupoPresupuestal={segundoGrupoPresupuestal}
                            tercerGrupoPresupuestal={tercerGrupoPresupuestal}
                            usosPresupuestales={usosPresupuestales}
                            conceptosViaticos={conceptosViaticos}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default RubrosPresupuestales
