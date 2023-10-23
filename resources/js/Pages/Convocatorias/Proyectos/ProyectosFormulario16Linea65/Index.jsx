import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, proyectos_formulario_16_linea_65, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [proyecto_linea_65_to_destroy, setProyectoFormulario16Linea65ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Lista de proyectos - Formulario 16 Línea 65" />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="0" convocatoria={convocatoria} tipo_formulario_convocatoria_id="16" />
                    </Grid>
                )}

                <Grid item md={12} className="!mt-20">
                    <h1 className="text-3xl text-center">Formulario 16: Protección y Transferencia de Conocimiento y Tecnología (Unidad de Propiedad Intelectual) - Línea 65</h1>
                </Grid>

                <Grid item md={12}>
                    <AlertMui className="mt-20">A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>

                    <SearchBar inputBackground="white" routeParams={[convocatoria.id]} className="my-10" />

                    <TableMui rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {allowed_to_create && (
                            <TableRow
                                onClick={() => router.visit(route('convocatorias.proyectos-formulario-16-linea-65.create', [convocatoria.id]))}
                                variant="raised"
                                className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                <TableCell colSpan={4}>
                                    <ButtonMui>
                                        <AddCircleOutlineOutlinedIcon className="mr-1" /> Formular un nuevo proyecto
                                    </ButtonMui>
                                </TableCell>
                            </TableRow>
                        )}
                        {proyectos_formulario_16_linea_65.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
                            <TableRow key={id}>
                                <TableCell>
                                    <div>
                                        <Chip className="mb-4" label={proyecto?.codigo} />

                                        <p className="uppercase mb-4 line-clamp-3">{titulo}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p>{fecha_ejecucion}</p>
                                </TableCell>
                                <TableCell>
                                    {is_super_admin ||
                                    checkRole(auth_user, [20]) ||
                                    (checkRole(auth_user, [4, 15]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                    (checkRole(auth_user, [4, 15]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ||
                                    (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                    (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ? (
                                        <>
                                            <AlertMui>
                                                {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.estado}
                                                <div>Puntaje: {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.puntaje}</div>
                                                <small>
                                                    Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.numero_recomendaciones}
                                                    <br />
                                                    Evaluaciones: {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.evaluaciones_habilitadas} habilitada(s) /{' '}
                                                    {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.evaluaciones_finalizadas} finalizada(s)
                                                </small>
                                            </AlertMui>
                                            {JSON.parse(proyecto.estado_cord_sennova)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true ? (
                                                <AlertMui error={true} className="mt-2">
                                                    Requiere ser subsanado
                                                </AlertMui>
                                            ) : (
                                                JSON.parse(proyecto.estado)?.requiereSubsanar &&
                                                proyecto.mostrar_recomendaciones == true &&
                                                proyecto.mostrar_requiere_subsanacion == true && (
                                                    <AlertMui error={true} className="mt-2">
                                                        Requiere ser subsanado
                                                    </AlertMui>
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <AlertMui>Aún no tiene permisos para ver el estado de evaluación de este proyecto.</AlertMui>
                                    )}

                                    {is_super_admin || checkRole(auth_user, [18]) ? (
                                        <>
                                            {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.alerta && (
                                                <AlertMui severity="error" className="mt-4">
                                                    Importante: {proyecto?.estado_evaluacion_proyecto_formulario_16_linea_65?.alerta}
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : null}
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />} className="">
                                        {proyecto.id !== proyecto_linea_65_to_destroy ? (
                                            <div>
                                                <MenuItem
                                                    onClick={() => router.visit(route('convocatorias.proyectos-formulario-16-linea-65.edit', [convocatoria.id, id]))}
                                                    disabled={!proyecto?.allowed?.to_view}>
                                                    {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                                </MenuItem>
                                                <MenuItem>
                                                    <a href={route(`convocatorias.proyectos.pdf-formulario16-linea65`, [convocatoria.id, proyecto.id])} target="_blank" className="flex items-center">
                                                        PDF del proyecto
                                                    </a>
                                                </MenuItem>
                                                <Divider />
                                                {proyecto.evaluaciones.map((evaluacion, i) => (
                                                    <MenuItem
                                                        key={i}
                                                        onClick={() =>
                                                            router.visit(route('convocatorias.proyectos-formulario-16-linea-65.edit', [convocatoria.id, id, { evaluacion_id: evaluacion?.id }]))
                                                        }
                                                        isabled={!is_super_admin}>
                                                        Evaluacion #{evaluacion.id}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem
                                                    onClick={() => {
                                                        setProyectoFormulario16Linea65ToDestroy(proyecto.id)
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_update}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setProyectoFormulario16Linea65ToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (proyecto.allowed.to_update) {
                                                            router.delete(route('convocatorias.proyectos-formulario-16-linea-65.destroy', [convocatoria.id, proyecto.id]), {
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

                    <PaginationMui links={proyectos_formulario_16_linea_65.links} className="mt-6" />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index
