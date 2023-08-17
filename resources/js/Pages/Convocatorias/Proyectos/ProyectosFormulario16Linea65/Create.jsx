import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({
    auth,
    convocatoria,
    centros_formacion,
    mesas_sectoriales,
    areas_conocimiento,
    lineas_programaticas,
    tematicas_estrategicas,
    programas_formacion_con_registro_calificado,
    programas_formacion_sin_registro_calificado,
    municipios,
    areas_cualificacion_mnc,
    ejes_sennova,
    roles_sennova,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                is_super_admin={is_super_admin}
                method="POST"
                convocatoria={convocatoria}
                centros_formacion={centros_formacion}
                mesas_sectoriales={mesas_sectoriales}
                lineas_programaticas={lineas_programaticas}
                tematicas_estrategicas={tematicas_estrategicas}
                programas_formacion_con_registro_calificado={programas_formacion_con_registro_calificado}
                programas_formacion_sin_registro_calificado={programas_formacion_sin_registro_calificado}
                municipios={municipios}
                ejes_sennova={ejes_sennova}
                areas_cualificacion_mnc={areas_cualificacion_mnc}
                roles_sennova={roles_sennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create