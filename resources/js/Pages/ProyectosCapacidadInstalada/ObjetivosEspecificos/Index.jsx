<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, inertia } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'
    import { _ } from 'svelte-i18n'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Pagination from '@/Components/Pagination'

    import Header from '../Shared/Header'

    export let proyectoCapacidadInstalada
    export let objetivosEspecificos

    $title = 'Objetivos específicos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogEliminar = false
    let allowedToDestroy = false
    let objetivoEspecificoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('proyectos-capacidad-instalada.objetivos-especificos.destroy', [proyectoCapacidadInstalada.id, objetivoEspecificoId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Header {proyectoCapacidadInstalada} />
    </header>

    <a use:inertia href={route('proyectos-capacidad-instalada.productos.index', proyectoCapacidadInstalada.id)} className="flex bottom-0 fixed hover:bg-app-600 mb-4 px-6 py-2 bg-app-700 rounded-lg shadow-2xl text-center text-white z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a los productos
    </a>

    <h1 className="mt-24 mb-8 text-center text-3xl">Objetivos específicos y resultados</h1>

    {#if proyectoCapacidadInstalada.allowed.to_update}
        <div className="mb-6 flex justify-between items-center">
            <Button on:click={() => Inertia.visit(route('proyectos-capacidad-instalada.objetivos-especificos.create', [proyectoCapacidadInstalada.id]))} variant="raised">Crear objetivo específico</Button>
        </div>
    {/if}
    <div className="bg-white rounded shadow">
        <table className="w-full whitespace-no-wrap table-fixed data-table">
            <thead>
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">#</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Objetivo específico</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Resultado</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each objetivosEspecificos.data as objetivoEspecifico (objetivoEspecifico.id)}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="px-6 py-4 focus:text-app-500">
                                {objetivoEspecifico.numero}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {objetivoEspecifico.descripcion}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {objetivoEspecifico.resultado.descripcion}
                            </p>
                        </td>
                        <td className="border-t td-actions">
                            <DataTableMenu className={objetivosEspecificos.data.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('proyectos-capacidad-instalada.objetivos-especificos.edit', [proyectoCapacidadInstalada.id, objetivoEspecifico.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>
                                <Separator className={!proyectoCapacidadInstalada.allowed.to_destroy ? 'hidden' : ''} />
                                <Item on:SMUI:action={() => ((objetivoEspecificoId = objetivoEspecifico.id), (dialogEliminar = true), (allowedToDestroy = proyectoCapacidadInstalada.allowed.to_destroy))} disabled={!proyectoCapacidadInstalada.allowed.to_destroy} className={!proyectoCapacidadInstalada.allowed.to_destroy ? 'hidden' : ''}>
                                    <Text>Eliminar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if objetivosEspecificos.data.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
    <Pagination links={objetivosEspecificos.links} />

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div className="text-center">Eliminar recurso</div>
            <div className="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" className="h-44 m-auto" />
                </figure>
            </div>
            <div className="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
