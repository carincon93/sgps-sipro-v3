<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\RegionalRequest;
use App\Models\Regional;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [Regional::class]);

        return Inertia::render('Regionales/Index', [
            'regionales'            => Regional::orderBy('nombre', 'ASC')->with('directorRegional')
                                        ->filterRegional(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'regiones'              => SelectHelper::regiones(),
            'directores_regionales' => SelectHelper::usuariosPorRol('director regional')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Regional::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RegionalRequest $request)
    {
        $this->authorize('create', [Regional::class]);

        $regional = Regional::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function show(Regional $regional)
    {
        $this->authorize('view', [Regional::class, $regional]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function edit(Regional $regional)
    {
        $this->authorize('update', [Regional::class, $regional]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function update(RegionalRequest $request, Regional $regional)
    {
        $this->authorize('update', [Regional::class, $regional]);

        $regional->update($request->validated());

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function destroy(Regional $regional)
    {
        $this->authorize('delete', [Regional::class, $regional]);

        // No se pueden eliminar regionales, solo el admin DB
        // $regional->delete();

        return back()->with('error', 'No se puede eliminar el recurso debido a que hay información relacionada. Comuníquese con el administrador del sistema.');
    }
}
