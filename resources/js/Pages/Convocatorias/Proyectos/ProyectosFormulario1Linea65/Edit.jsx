import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import DialogMui from '@/Components/Dialog'
import ButtonMui from '@/Components/Button'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import Form from './Form'

import { checkRole } from '@/Utils'

import { Chip, Grid, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

const Edit = ({
    auth,
    convocatoria,
    proyecto_formulario_1_linea_65,
    evaluacion,
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    lineas_investigacion,
    lineas_programaticas,
    ejes_sennova,
    areas_cualificacion_mnc,
    lineas_estrategicas_sena,
    lineas_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    tecnoacademia,
    tecnoacademias,
    nodos_tecnoparques,
    hubs_innovacion,
    laboratorios_st,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    tipos_eventos,
    roles_sennova,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [evaluacion_index, setEvaluacionIndex] = useState(0)
    const [dialog_status, setDialogStatus] = useState(false)

    const comentarios_evaluaciones =
        proyecto_formulario_1_linea_65?.proyecto?.evaluaciones?.length > 0
            ? Object.keys(proyecto_formulario_1_linea_65?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario1_linea65).filter((field) => field.endsWith('_comentario'))
            : null

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{proyecto_formulario_1_linea_65.titulo}</h2>}>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_formulario_1_linea_65?.proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
                Evaluación
            </Grid>

            <Grid item md={8}>
                <ButtonMui onClick={() => setDialogStatus(true)} primary={true}>
                    Revisar evaluaciones
                </ButtonMui>
                <DialogMui
                    fullWidth={true}
                    maxWidth="lg"
                    open={dialog_status}
                    dialogContent={
                        <>
                            {proyecto_formulario_1_linea_65?.proyecto.evaluaciones.map((evaluacion, i) => (
                                <ButtonMui onClick={() => setEvaluacionIndex(i)} primary={evaluacion_index == i} key={i} className="!ml-2">
                                    Comentarios de la evaluación #{i + 1} <Chip className="ml-2 !text-white" label={evaluacion.id} size="small" />
                                </ButtonMui>
                            ))}
                            <TableMui className="mt-20" rows={['Ítem', 'Comentario']}>
                                {comentarios_evaluaciones &&
                                    comentarios_evaluaciones
                                        .sort((a, b) => a.toString().localeCompare(b.toString()))
                                        .map((field, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <p className="first-letter:uppercase">{field.replace(/_comentario/g, '').replace(/_/g, ' ')}</p>
                                                </TableCell>
                                                <TableCell>{proyecto_formulario_1_linea_65?.proyecto.evaluaciones[evaluacion_index].evaluacion_proyecto_formulario1_linea65[field] ?? 'Sin comentarios'}</TableCell>
                                            </TableRow>
                                        ))}
                            </TableMui>
                        </>
                    }
                    dialogActions={
                        <ButtonMui onClick={() => setDialogStatus(false)} primary={true} className="!mr-6">
                            Cerrar
                        </ButtonMui>
                    }
                />
            </Grid> */}

            <Grid item md={12}>
                <Form
                    is_super_admin={is_super_admin}
                    method="PUT"
                    convocatoria={convocatoria}
                    proyecto_formulario_1_linea_65={proyecto_formulario_1_linea_65}
                    centros_formacion={centros_formacion}
                    mesas_sectoriales={mesas_sectoriales}
                    areas_conocimiento={areas_conocimiento}
                    lineas_investigacion={lineas_investigacion}
                    lineas_programaticas={lineas_programaticas}
                    ejes_sennova={ejes_sennova}
                    areas_cualificacion_mnc={areas_cualificacion_mnc}
                    lineas_estrategicas_sena={lineas_estrategicas_sena}
                    lineas_tecnoacademia={lineas_tecnoacademia}
                    actividades_economicas={actividades_economicas}
                    tematicas_estrategicas={tematicas_estrategicas}
                    tecnoacademia={tecnoacademia}
                    tecnoacademias={tecnoacademias}
                    nodos_tecnoparques={nodos_tecnoparques}
                    hubs_innovacion={hubs_innovacion}
                    laboratorios_st={laboratorios_st}
                    programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                    programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                    municipios={municipios}
                    tipos_eventos={tipos_eventos}
                    roles_sennova={roles_sennova}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
