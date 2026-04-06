<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    public function index(Request $request)
    {
        $query = Cita::with('paciente', 'profesional.especialidad', 'servicios');

        if ($request->has('fecha')) {
            $query->where('fecha', $request->fecha);
        }
        if ($request->has('profesional_id')) {
            $query->where('profesional_id', $request->profesional_id);
        }
        if ($request->has('paciente_id')) {
            $query->where('paciente_id', $request->paciente_id);
        }

        return $query->orderBy('fecha')->orderBy('hora')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:users,id',
            'profesional_id' => 'required|exists:profesionales,id',
            'fecha' => 'required|date',
            'hora' => 'required',
            'servicios' => 'required|array|min:1',
            'servicios.*' => 'exists:servicios,id',
        ]);

        $existente = Cita::where('profesional_id', $request->profesional_id)
            ->where('fecha', $request->fecha)
            ->where('hora', $request->hora)
            ->whereNotIn('estado', ['cancelada'])
            ->first();

        if ($existente) {
            return response()->json(['message' => 'Ya existe una cita en ese horario'], 422);
        }

        $cita = Cita::create([
            'paciente_id' => $request->paciente_id,
            'profesional_id' => $request->profesional_id,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'estado' => 'confirmada',
            'notas' => $request->notas,
        ]);

        $cita->servicios()->attach($request->servicios);

        return response()->json($cita->load('paciente', 'profesional.especialidad', 'servicios'), 201);
    }

    public function show(Cita $cita)
    {
        return $cita->load('paciente', 'profesional.especialidad', 'servicios');
    }

    public function update(Request $request, Cita $cita)
    {
        $request->validate([
            'estado' => 'sometimes|in:pendiente,confirmada,cancelada,completada',
            'fecha' => 'sometimes|date',
            'hora' => 'sometimes',
        ]);

        $cita->update($request->only('fecha', 'hora', 'estado', 'notas'));

        if ($request->has('servicios')) {
            $cita->servicios()->sync($request->servicios);
        }

        return response()->json($cita->load('paciente', 'profesional.especialidad', 'servicios'));
    }

    public function destroy(Cita $cita)
    {
        $cita->update(['estado' => 'cancelada']);

        return response()->json(['message' => 'Cita cancelada correctamente']);
    }

    public function dashboard()
    {
        $hoy = now()->toDateString();

        $citasHoy = Cita::where('fecha', $hoy)->whereNotIn('estado', ['cancelada'])->count();
        $citasSemana = Cita::whereBetween('fecha', [now()->startOfWeek(), now()->endOfWeek()])
            ->whereNotIn('estado', ['cancelada'])->count();

        $ingresosTotales = Cita::where('estado', 'completada')
            ->with('servicios')
            ->get()
            ->sum(fn ($c) => $c->servicios->sum('precio'));

        $ingresosSemana = Cita::where('estado', 'completada')
            ->whereBetween('fecha', [now()->startOfWeek(), now()->endOfWeek()])
            ->with('servicios')
            ->get()
            ->sum(fn ($c) => $c->servicios->sum('precio'));

        $totalPacientes = \App\Models\User::where('role', 'paciente')->count();

        return response()->json([
            'citasHoy' => $citasHoy,
            'citasSemana' => $citasSemana,
            'ingresosTotales' => $ingresosTotales,
            'ingresosSemana' => $ingresosSemana,
            'totalPacientes' => $totalPacientes,
        ]);
    }
}
