<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        return Servicio::with('especialidad')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'duracion_minutos' => 'required|integer|min:1|max:120',
            'especialidad_id' => 'required|exists:especialidades,id',
        ], [
            'duracion_minutos.max' => 'La duracion maxima permitida es de 120 minutos.',
        ]);

        $servicio = Servicio::create($request->only('nombre', 'descripcion', 'precio', 'duracion_minutos', 'especialidad_id'));

        return response()->json($servicio->load('especialidad'), 201);
    }

    public function show(Servicio $servicio)
    {
        return $servicio->load('especialidad');
    }

    public function update(Request $request, Servicio $servicio)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'precio' => 'sometimes|numeric|min:0',
            'duracion_minutos' => 'sometimes|integer|min:1|max:120',
            'especialidad_id' => 'sometimes|exists:especialidades,id',
        ], [
            'duracion_minutos.max' => 'La duracion maxima permitida es de 120 minutos.',
        ]);

        $servicio->update($request->only('nombre', 'descripcion', 'precio', 'duracion_minutos', 'especialidad_id'));

        return response()->json($servicio->load('especialidad'));
    }

    public function destroy(Servicio $servicio)
    {
        $servicio->delete();

        return response()->json(['message' => 'Servicio eliminado correctamente']);
    }
}
