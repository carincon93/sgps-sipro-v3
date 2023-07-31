<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors

    $: $title = 'Crear rubro del primer grupo presupuestal'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: '',
        cta: '',
        bpin: '',
    })

    function submit() {
        if (is_super_admin) {
            $form.post(route('primer-grupo-presupuestal.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('primer-grupo-presupuestal.index')} className="text-app-400 hover:text-app-600"> Primer grupo presupuestal </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo rubro del primer grupo presupuestal</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {form} {submit} {is_super_admin} />
        </div>
    </div>
</AuthenticatedLayout>
