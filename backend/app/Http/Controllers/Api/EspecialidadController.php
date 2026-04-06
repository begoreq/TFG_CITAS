<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Especialidad;
use Illuminate\Http\Request;

class EspecialidadController extends Controller
{
    public function index()
    {
        return Especialidad::with('profesionales', 'servicios')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $especialidad = Especialidad::create($request->only('nombre', 'icono', 'color'));

        return response()->json($especialidad, 201);
    }

    public function show(Especialidad $especialidad)
    {
        return $especialidad->load('profesionales', 'servicios');
    }

    public function update(Request $request, Especialidad $especialidad)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
        ]);

        $especialidad->update($request->only('nombre', 'icono', 'color'));

        return response()->json($especialidad);
    }

    public function destroy(Especialidad $especialidad)
    {
        $especialidad->delete();

        return response()->json(['message' => 'Especialidad eliminada correctamente']);
    }
}
