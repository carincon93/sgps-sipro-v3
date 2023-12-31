import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, hubs_innovacion }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [hub_innovacion, setHubInnovacion] = useState(null)
    const [hub_innovacion_to_destroy, setHubInnovacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Hubs de innovación" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Hub de innovación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setHubInnovacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar Hub de innovación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {hubs_innovacion.data.map((hub_innovacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{hub_innovacion.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {hub_innovacion.id !== hub_innovacion_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setHubInnovacion(hub_innovacion))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setHubInnovacionToDestroy(hub_innovacion.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setHubInnovacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('hubs-innovacion.destroy', [hub_innovacion.id]), {
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

                <PaginationMui links={hubs_innovacion.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} hub_innovacion={hub_innovacion} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index
