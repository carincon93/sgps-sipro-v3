<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let primerGrupoPresupuestal

    $title = 'Primer grupo presupuestal'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let isSuperAdmin = checkRole(auth_user, [1])

    let filters = {}

    let dialogEliminar = false
    let allowedToDestroy = false
    let rubroPrimerGrupoPresupuestalId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('primer-grupo-presupuestal.destroy', rubroPrimerGrupoPresupuestalId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20">
        <div slot="title">Primer grupo presupuestal</div>

        <div slot="actions">
            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('primer-grupo-presupuestal.create'))} variant="raised">Crear rubro del primer grupo presupuestal</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> CTA </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> BPIN </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each primerGrupoPresupuestal.data as rubro (rubro.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.nombre}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">
                            {rubro.cta}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">
                            {rubro.bpin}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={primerGrupoPresupuestal.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('primer-grupo-presupuestal.edit', rubro.id))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!isSuperAdmin ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((rubroPrimerGrupoPresupuestalId = rubro.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if primerGrupoPresupuestal.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={primerGrupoPresupuestal.links} />

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
