import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Breadcrumbs, Divider, Grid, MenuItem, Tab, TableCell, TableRow, Tabs } from '@mui/material'

import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, grupo_investigacion, lineas_investigacion, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_semilleros_investigacion_status, setDialogSemillerosInvestigacionStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [linea_investigacion, setLineaInvestigacion] = useState(null)
    const [linea_investigacion_to_destroy, setLineaInvestigacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Líneas de investigación" />

            <Grid item md={12} className="!mb-20">
                <Tabs value="1" centered={true}>
                    <Tab
                        component="a"
                        onClick={() => {
                            router.visit(route('grupos-investigacion.show', [grupo_investigacion.id]))
                        }}
                        label={grupo_investigacion.nombre}
                        value="0"
                    />
                    <Tab component="a" label="Líneas de investigación" value="1" />

                    <Tab
                        component="button"
                        onClick={() => {
                            setDialogSemillerosInvestigacionStatus(true)
                        }}
                        label="Semilleros de investigación"
                        value="2"
                    />
                </Tabs>
            </Grid>
            <Grid item md={12}>
                <SearchBar routeParams={[grupo_investigacion.id]} />

                <TableMui className="mt-20" rows={['Nombre', 'Grupo de investigación', 'Centro de formación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {allowed_to_create ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setLineaInvestigacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar línea de investigación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {lineas_investigacion.data.map((linea_investigacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{linea_investigacion.nombre}</TableCell>
                            <TableCell> {linea_investigacion.grupo_investigacion?.nombre}</TableCell>
                            <TableCell>{linea_investigacion.grupo_investigacion.centro_formacion?.regional?.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {linea_investigacion.id !== linea_investigacion_to_destroy ? (
                                        <div>
                                            {/* <MenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.visit(route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.index', [grupo_investigacion.id, linea_investigacion.id]), {
                                                        preserveScroll: true,
                                                    })
                                                }}>
                                                Semilleros de investigación
                                            </MenuItem>

                                            <Divider /> */}

                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setLineaInvestigacion(linea_investigacion))}
                                                disabled={!linea_investigacion?.allowed?.to_view}>
                                                {linea_investigacion?.allowed?.to_view && !linea_investigacion?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>

                                            {is_super_admin && (
                                                <>
                                                    <Divider />

                                                    <MenuItem
                                                        onClick={() => {
                                                            setLineaInvestigacionToDestroy(linea_investigacion.id)
                                                        }}
                                                        disabled={!linea_investigacion?.allowed?.to_update}>
                                                        Eliminar
                                                    </MenuItem>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setLineaInvestigacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (linea_investigacion.allowed.to_update) {
                                                        router.delete(route('grupos-investigacion.lineas-investigacion.destroy', [grupo_investigacion.id, linea_investigacion.id]), {
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

                <PaginationMui links={lineas_investigacion.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            allowed_to_create={allowed_to_create}
                            method={method}
                            grupo_investigacion={grupo_investigacion}
                            linea_investigacion={linea_investigacion}
                        />
                    }
                />

                <DialogMui
                    open={dialog_semilleros_investigacion_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <>
                            <p className="mb-6">Seleccione una línea de investigación:</p>
                            <ul>
                                {lineas_investigacion.data.map((linea_investigacion, i) => (
                                    <li key={i}>
                                        <Link
                                            href={route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.index', [grupo_investigacion.id, linea_investigacion.id])}
                                            className="bg-white hover:bg-white/50 shadow p-2 rounded my-2 inline-block">
                                            <ArrowForwardIcon className="mr-2" />
                                            Semilleros de investigación de la línea {linea_investigacion.nombre}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                    dialogActions={
                        <ButtonMui type="button" onClick={() => setDialogSemillerosInvestigacionStatus(false)} className="!ml-2">
                            Cancelar
                        </ButtonMui>
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index
