<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'
    import moment from 'moment'

    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let notificaciones

    $title = 'Notificaciones'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    function showMore(id) {
        document.getElementById(id).classList.toggle('paragraph-ellipsis')
        if (document.getElementById(id).classList.contains('paragraph-ellipsis')) {
            document.querySelector('#button-id-' + id + ' .mdc-button__label').innerHTML = 'Ver más'
        } else {
            document.querySelector('#button-id-' + id + ' .mdc-button__label').innerHTML = 'Ver menos'
        }
    }

    function marcarLeido(notificacionId) {
        Inertia.post(
            route('notificaciones.marcar-leido'),
            {
                notificacion: notificacionId,
            },
            {
                preserveScroll: true,
            },
        )
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20">
        <div slot="title">Notificaciones</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Notificación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each notificaciones.data as notificacion}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <div className="px-6 py-4">
                            <div className="flex items-center">
                                <small className="mr-2">{moment(notificacion.created_at).locale('es').fromNow()}</small> |
                                {#if notificacion.read_at}
                                    <span className="bg-green-500 focus:text-app-500 px-4 rounded text-center text-white text-xs ml-2"> Leído </span>
                                {:else}
                                    <span className="bg-red-500 focus:text-app-500 px-4 rounded text-center text-white text-xs ml-2 mr-2"> Sin leer </span>
                                    <Button on:click={() => marcarLeido(notificacion.id)} variant={null}>Marcar como leído</Button>
                                {/if}
                            </div>
                            <p id={notificacion.id} className="focus:text-app-500 whitespace-pre-wrap mt-10{notificacion.data.message.length > 521 ? ' paragraph-ellipsis' : ''}">
                                {#if notificacion.data.proyectoId}
                                    Código del proyecto: SGPS-{notificacion.data.proyectoId + 8000}-SIPRO
                                    <br />
                                {/if}
                                {notificacion.data.message}
                            </p>
                            {#if notificacion.data.message.length > 521}
                                <div className="text-center justify-center mt-4">
                                    <Button on:click={() => showMore(notificacion.id)} id={'button-id-' + notificacion.id} variant={null}>Ver más</Button>
                                </div>
                            {/if}
                        </div>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={notificaciones.data.length < 3 ? 'z-50' : ''}>
                            {#if notificacion.data.action}
                                <Item on:SMUI:action={() => Inertia.visit(notificacion.data.action)}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {:else}
                                <Item>
                                    <Text>No hay acciones disponibles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if notificaciones.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={notificaciones.links} />
</AuthenticatedLayout>
