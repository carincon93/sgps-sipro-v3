import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole } from '@/Utils'
import { Head } from '@inertiajs/react'

const Create = ({ auth, convocatoria, centros_formacion, roles_sennova, allowed_to_create }) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout>
            <Head title="Formular proyecto" />

            <Form auth_user={auth_user} method="POST" convocatoria={convocatoria} centros_formacion={centros_formacion} roles_sennova={roles_sennova} allowed_to_create={allowed_to_create} />
        </AuthenticatedLayout>
    )
}

export default Create
