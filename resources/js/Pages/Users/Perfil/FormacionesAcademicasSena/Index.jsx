<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let formacionesAcademicasSena

    function destroy(formacionAcademicaSenaId) {
        Inertia.delete(route('formaciones-academicas-sena.destroy', formacionAcademicaSenaId), {
            preserveScroll: true,
        })
    }
</script>

<div className="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('formaciones-academicas-sena.create'))} className="m-2" variant="raised">Agregar formación académica SENA</Button>

    <table className="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Modalidad </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nivel académico </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full th-actions"> Título obtenido </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each formacionesAcademicasSena as formacionAcademicaSena}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">{formacionAcademicaSena.modalidad_sena_text}</p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">{formacionAcademicaSena.nivel_sena_text}</p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">{formacionAcademicaSena.titulo_obtenido}</p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className="{formacionesAcademicasSena.length < 3 ? 'z-50' : ''} flex items-center justify-center">
                            <Item on:SMUI:action={() => Inertia.visit(route('formaciones-academicas-sena.edit', formacionAcademicaSena.id))}>
                                <Text>Editar</Text>
                            </Item>

                            <Separator />
                            <Item on:SMUI:action={() => destroy(formacionAcademicaSena.id)}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if formacionesAcademicasSena.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
