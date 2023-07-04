<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import SemillerosInvestigacion from './SemillerosInvestigacion'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto

    $: $title = 'Participantes'
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <div className="py-12">
        <hr className="my-16" />
        {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 || proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 65}
            <div>
                <SemillerosInvestigacion {convocatoria} {proyecto} {errors} />
            </div>
        {/if}
    </div>
</AuthenticatedLayout>
