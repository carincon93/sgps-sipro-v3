<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Stepper from '@/Components/Stepper'
    import Gantt from '@/Components/Gantt'
    import InfoMessage from '@/Components/InfoMessage'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let convocatoria
    export let proyecto
    export let productos
    export let productosGantt
    export let validacionResultados
    export let to_pdf

    $title = 'Productos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let showGantt = false

    let dialogEliminar = false
    let allowedToDestroy = false
    let productoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.productos.destroy', [convocatoria.id, proyecto.id, productoId]), {
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
        <Stepper {convocatoria} {proyecto} />
    </header>

    <h1 className="text-3xl mt-24 mb-8 text-center">Productos</h1>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 68 || proyecto.codigo_linea_programatica == 82}
        {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
            <div className="mb-20">
                <RecomendacionEvaluador className="mt-8">
                    {#each proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                {#if evaluacion.idi_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.productos_comentario ? evaluacion.idi_evaluacion.productos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.cultura_innovacion_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.productos_comentario ? evaluacion.cultura_innovacion_evaluacion.productos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.servicio_tecnologico_evaluacion}
                                    <hr className="mt-10 mb-10 border-black-200" />
                                    <h1 className="font-black">Productos</h1>

                                    <ul className="list-disc pl-4">
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.productos_primer_obj_comentario ? 'Recomendación productos del primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.productos_primer_obj_comentario : 'Sin recomendación'}</li>
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.productos_segundo_obj_comentario ? 'Recomendación productos del segundo objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.productos_segundo_obj_comentario : 'Sin recomendación'}</li>
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.productos_tercer_obj_comentario ? 'Recomendación productos del tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.productos_tercer_obj_comentario : 'Sin recomendación'}</li>
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.productos_cuarto_obj_comentario ? 'Recomendación productos del cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.productos_cuarto_obj_comentario : 'Sin recomendación'}</li>
                                    </ul>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                    {#if proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            </div>
        {/if}
    {/if}

    <p className="text-justify mb-10">Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.</p>

    {#if validacionResultados}
        <InfoMessage message={validacionResultados} className="mt-10 mb-10" />
    {/if}

    {#if proyecto.codigo_linea_programatica == 70}
        <InfoMessage>
            Debe asociar las fechas y actividades a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Ver detalles'. (<strong>Se deben registrar todas las fechas para visualizar el diagrama de Gantt</strong>).
        </InfoMessage>
    {/if}

    {#if showGantt || to_pdf}
        <Button on:click={() => (showGantt = false)}>Ocultar diagrama de Gantt</Button>
    {/if}

    {#if showGantt || to_pdf}
        <Gantt
            items={productosGantt}
            request={{
                uri: 'convocatorias.proyectos.productos.edit',
                params: [convocatoria.id, proyecto.id],
            }}
        />
    {:else}
        <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
            <div slot="actions">
                <Button on:click={() => (showGantt = true)}>Visualizar diagrama de Gantt</Button>
                {#if isSuperAdmin || checkRole([5, 17]) || (proyecto.allowed.to_update && validacionResultados == null && proyecto.modificable == true && proyecto.codigo_linea_programatica != 70)}
                    <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.productos.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear producto</Button>
                {/if}
            </div>

            <thead slot="thead">
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Objetivo específico</th>
                    {#if proyecto.codigo_linea_programatica != 69 && proyecto.codigo_linea_programatica != 70}
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Resultado</th>
                    {:else if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Meta</th>
                    {/if}
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>

            <tbody slot="tbody">
                {#each productos.data as producto (producto.id)}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {producto.nombre}
                            </p>
                        </td>

                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {producto.resultado.objetivo_especifico.descripcion}
                            </p>
                        </td>

                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {#if proyecto.codigo_linea_programatica != 69 && proyecto.codigo_linea_programatica != 70}
                                    Código {producto.resultado.id} -

                                    {producto.resultado.descripcion}
                                {:else if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                                    {producto.producto_ta_tp?.valor_proyectado}
                                {/if}
                            </p>
                        </td>

                        <td className="border-t td-actions">
                            <DataTableMenu className={productos.data.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.productos.edit', [convocatoria.id, proyecto.id, producto.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>

                                <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                                <Item on:SMUI:action={() => ((productoId = producto.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                    <Text>Eliminar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if productos.data.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                    </tr>
                {/if}
            </tbody>
        </DataTable>
        <Pagination links={productos.links} />
    {/if}

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
