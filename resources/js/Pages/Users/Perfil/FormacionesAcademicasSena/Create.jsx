<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let modalidadesEstudio
    export let nivelesFormacion

    $: $title = 'Agregar formación académica SENA'

    let form = useForm({
        egresado_sena: false,
        modalidad_sena: '',
        nivel_sena: '',
        titulo_obtenido: '',
        fecha_inicio_formacion: '',
        fecha_finalizacion_formacion: '',
        certificado_formacion: null,
    })

    function submit() {
        $form.post(route('formaciones-academicas-sena.store'))
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('users.change-user-profile')} className="text-app-400 hover:text-app-600"> Perfil </a>
                    <span className="text-app-400 font-medium">/</span>
                    Agregar formación académica SENA
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Agregar formación académica SENA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {form} {submit} {modalidadesEstudio} {nivelesFormacion} />
        </div>
    </div>
</AuthenticatedLayout>
