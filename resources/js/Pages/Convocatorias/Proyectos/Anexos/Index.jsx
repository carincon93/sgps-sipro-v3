import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import StepperMui from '@/Components/Stepper'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'

import Evaluacion from './Evaluacion'
import Form from './Form'

import { checkRole } from '@/Utils'

import DownloadIcon from '@mui/icons-material/Download'
import { Grid, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

const Anexos = ({ auth, convocatoria, proyecto, evaluacion, proyecto_anexo, anexos, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid>

            <AlertMui className="mt-20">
                <h1 className="mb-10 font-black">Importante:</h1>
                <ul>
                    <li>
                        <strong>ANEXO 1A. Acta_Reunión Regional</strong> NO se adjunta en plataforma. Se envía junto al Anexo 1B a la Coordinación Sennova (Obligatorio)
                    </li>

                    <li>
                        <strong>ANEXO 1C. Carta C.I Director Regional</strong> NO se adjunta en plataforma. Se envía a la Coordinación Sennova, uno por regional, junto con el Anexo 1A (Obligatorio)
                    </li>
                </ul>
            </AlertMui>

            {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea66.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea65?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea65.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea70 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea70.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : evaluacion.evaluacion_proyecto_linea69 ? (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea69?.anexos_comentario ? evaluacion.evaluacion_proyecto_linea69.anexos_comentario : 'Sin recomendación'}
                                            </p>
                                        ) : (
                                            evaluacion.evaluacion_proyecto_linea68 && (
                                                <>
                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Anexos</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.anexos_comentario
                                                                ? 'Recomendación anexos: ' + evaluacion.evaluacion_proyecto_linea68.anexos_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>

                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Video</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.video_comentario
                                                                ? 'Recomendación video: ' + evaluacion.evaluacion_proyecto_linea68.video_comentario
                                                                : 'Sin recomendación'}
                                                        </li>
                                                    </ul>

                                                    <hr className="mt-10 mb-10 border-black-200" />
                                                    <h1 className="font-black">Especificaciones del área</h1>

                                                    <ul className="list-disc pl-4">
                                                        <li className="whitespace-pre-line mb-10">
                                                            {evaluacion.evaluacion_proyecto_linea68?.especificaciones_area_comentario
                                                                ? 'Recomendación especificaciones área: ' + evaluacion.evaluacion_proyecto_linea68.especificaciones_area_comentario
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

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Nombre', 'Archivo']} sxCellThead={{ width: '320px' }}>
                    {anexos.data.map((anexo, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="px-6 py-4 focus:text-app-500">
                                    {anexo.nombre}
                                    <br />
                                    {anexo.obligatorio && <span className="text-red-500">* El anexo es obligatorio</span>}
                                    {anexo.archivo && (
                                        <a target="_blank" className="text-app-400 underline mt-4 mb-4 flex" download href={anexo.archivo}>
                                            <DownloadIcon /> Descargar formato para diligenciar dando clic en este enlace.
                                        </a>
                                    )}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Form convocatoria={convocatoria} proyecto={proyecto} anexo={anexo} proyecto_anexo={proyecto_anexo} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableMui>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Anexos
