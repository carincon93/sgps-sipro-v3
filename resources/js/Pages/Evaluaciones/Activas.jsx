<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let evaluaciones

    $title = 'Evaluaciones activas'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" showFilters={false} showSearchInput={false}>
        <div slot="title">Evaluaciones activas</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Título</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluador</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado evaluación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado proyecto</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each evaluaciones.data as evaluacion}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t" style="border-left: 1px solid limegreen">
                        <p className="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.codigo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {evaluacion.proyecto.idi
                                ? evaluacion.proyecto.idi.titulo
                                : evaluacion.proyecto.cultura_innovacion
                                ? evaluacion.proyecto.cultura_innovacion.titulo
                                : evaluacion.proyecto.servicio_tecnologico
                                ? evaluacion.proyecto.servicio_tecnologico.titulo
                                : evaluacion.proyecto.tp?.nodo_tecnoparque
                                ? evaluacion.proyecto.tp?.titulo
                                : evaluacion.proyecto.tecnoacademia_lineas_tecnoacademia
                                ? evaluacion.proyecto.tecnoacademia_lineas_tecnoacademia[0]?.tecnoacademia.nombre
                                : null}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {evaluacion.proyecto.centro_formacion.nombre + ' - Código: ' + evaluacion.proyecto.centro_formacion.codigo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {evaluacion.evaluador.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            <br />
                            {evaluacion.verificar_estado_evaluacion}
                            <br />
                            {evaluacion.habilitado ? 'Habilitada' : 'Deshabilitada'}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">
                            {#if evaluacion.proyecto.estado_evaluacion_idi}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if is_super_admin || checkRole(auth_user, [20, 18, 19, 5, 17])}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_cultura_innovacion}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if is_super_admin || checkRole(auth_user, [20, 18, 19, 5, 17])}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_servicios_tecnologicos}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if is_super_admin || checkRole(auth_user, [20, 18, 19, 5, 17])}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_ta}
                                {evaluacion.proyecto.estado_evaluacion_ta.estado}
                                {#if is_super_admin || checkRole(auth_user, [20, 18, 19, 5, 17])}
                                    <small>
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_tp}
                                {evaluacion.proyecto.estado_evaluacion_tp.estado}
                                {#if is_super_admin || checkRole(auth_user, [20, 18, 19, 5, 17])}
                                    <small>
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {/if}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={evaluaciones.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('evaluaciones.edit', evaluacion.id))} disabled={!evaluacion.allowed.to_view} className={!evaluacion.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if evaluaciones.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="6">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={evaluaciones.links} />
</AuthenticatedLayout>
