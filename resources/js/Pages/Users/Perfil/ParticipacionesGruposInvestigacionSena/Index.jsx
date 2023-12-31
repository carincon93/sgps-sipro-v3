import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import { router } from '@inertiajs/react'
import { useState } from 'react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

const ParticipacionesGrupoInvestigacionSENA = ({ usuario, participaciones_grupos_investigacion_sena, grupos_investigacion, semilleros_investigacion }) => {
    const [participacion_grupo_investigacion_sena_to_destroy, setParticipacionGrupoInvestigacionSenaToDestroy] = useState(null)
    const [participacion_grupo_investigacion_sena, setParticipacionGrupoInvestigacionSena] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')

    return (
        <>
            <TableMui rows={['Grupo de investigación', 'Semillero de investigación', 'Acciones']} sxCellThead={{ width: '320px' }} className="mt-10">
                {usuario?.allowed?.to_update && (
                    <TableRow
                        onClick={() => (setDialogStatus(true), setMethod('POST'), setParticipacionGrupoInvestigacionSena(null))}
                        variant="raised"
                        className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                        <TableCell colSpan={3}>
                            <ButtonMui>
                                <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar participación
                            </ButtonMui>
                        </TableCell>
                    </TableRow>
                )}
                {participaciones_grupos_investigacion_sena.map((participacion_grupo_investigacion_sena, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <p className="px-6 py-4 focus:text-app-500">
                                {participacion_grupo_investigacion_sena.grupo_investigacion
                                    ? participacion_grupo_investigacion_sena.grupo_investigacion?.nombre
                                    : 'No pertenece al grupo de investigación de su centro'}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p className="px-6 py-4">
                                {participacion_grupo_investigacion_sena.semillero_investigacion
                                    ? participacion_grupo_investigacion_sena.semillero_investigacion.nombre
                                    : 'No pertenece al semillero de investigación de su centro'}
                            </p>
                        </TableCell>

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {participacion_grupo_investigacion_sena.id !== participacion_grupo_investigacion_sena_to_destroy ? (
                                    <div>
                                        <MenuItem
                                            onClick={() => (setDialogStatus(true), setMethod('PUT'), setParticipacionGrupoInvestigacionSena(participacion_grupo_investigacion_sena))}
                                            disabled={!usuario?.allowed?.to_view}>
                                            {usuario?.allowed?.to_view && !usuario?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setParticipacionGrupoInvestigacionSenaToDestroy(participacion_grupo_investigacion_sena.id)
                                            }}
                                            disabled={!usuario?.allowed?.to_update}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setParticipacionGrupoInvestigacionSenaToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('participaciones-grupos-investigacion-sena.destroy', [participacion_grupo_investigacion_sena.id]), {
                                                    preserveScroll: true,
                                                })
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

            <DialogMui
                open={dialog_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <Form
                        method={method}
                        setDialogStatus={setDialogStatus}
                        usuario={usuario}
                        participacion_grupo_investigacion_sena={participacion_grupo_investigacion_sena}
                        grupos_investigacion={grupos_investigacion}
                        semilleros_investigacion={semilleros_investigacion}
                    />
                }
            />
        </>
    )
}

export default ParticipacionesGrupoInvestigacionSENA
