<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CitaController extends Controller
{
    private function soportaNoAsistio(): bool
    {
        return Schema::hasColumn('citas', 'no_asistio');
    }

    private function haySolapeHorario(int $profesionalId, string $fecha, string $horaInicio, int $duracionMinutos, ?int $ignorarCitaId = null): bool
    {
        $inicioNueva = Carbon::createFromFormat('H:i', substr($horaInicio, 0, 5));
        $finNueva = (clone $inicioNueva)->addMinutes(max($duracionMinutos, 30));

        $query = Cita::with('servicios')
            ->where('profesional_id', $profesionalId)
            ->where('fecha', $fecha)
            ->whereNotIn('estado', ['cancelada']);

        if ($ignorarCitaId) {
            $query->where('id', '!=', $ignorarCitaId);
        }

        $existente = $query->get()->first(function ($citaExistente) use ($inicioNueva, $finNueva) {
            $inicioExistente = Carbon::createFromFormat('H:i', substr((string) $citaExistente->hora, 0, 5));
            $duracionExistente = (int) $citaExistente->servicios->sum('duracion_minutos');
            if ($duracionExistente <= 0) {
                $duracionExistente = 30;
            }
            $finExistente = (clone $inicioExistente)->addMinutes($duracionExistente);

            return $inicioNueva->lt($finExistente) && $finNueva->gt($inicioExistente);
        });

        return (bool) $existente;
    }

    // Festivos nacionales España (se puede ampliar)
    private function esFestivo(string $fecha): bool
    {
        $y = Carbon::parse($fecha)->year;
        $festivos = [
            "$y-01-01", "$y-01-06", "$y-05-01", "$y-08-15",
            "$y-10-12", "$y-11-01", "$y-12-06", "$y-12-08", "$y-12-25",
        ];
        return in_array($fecha, $festivos);
    }

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

        return $query->orderBy('estado', 'asc')->orderBy('hora', 'asc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:users,id',
            'profesional_id' => 'required|exists:profesionales,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required',
            'servicios' => 'required|array|min:1',
            'servicios.*' => 'exists:servicios,id',
        ]);

        // Bloqueo festivos
        if ($this->esFestivo($request->fecha)) {
            return response()->json(['message' => 'No se pueden reservar citas en días festivos'], 422);
        }

        // Bloqueo domingos
        if (Carbon::parse($request->fecha)->isSunday()) {
            return response()->json(['message' => 'No se pueden reservar citas en domingo'], 422);
        }

        $duracionNueva = (int) Servicio::whereIn('id', $request->servicios)->sum('duracion_minutos');
        if ($duracionNueva <= 0) {
            $duracionNueva = 30;
        }

        if ($this->haySolapeHorario((int) $request->profesional_id, (string) $request->fecha, (string) $request->hora, $duracionNueva)) {
            return response()->json(['message' => 'La cita se solapa con otra ya reservada'], 422);
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
        $rules = [
            'estado' => 'sometimes|in:pendiente,confirmada,cancelada,completada',
            'fecha' => 'sometimes|date',
            'hora' => 'sometimes',
            'notas_medicas' => 'sometimes|nullable|string',
            'paciente_nombre' => 'sometimes|nullable|string|max:255',
            'paciente_email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($cita->paciente_id),
            ],
            'paciente_telefono' => ['sometimes', 'nullable', 'string', 'max:15', 'regex:/^[0-9+()\- ]{9,15}$/'],
        ];

        if ($this->soportaNoAsistio()) {
            $rules['no_asistio'] = 'sometimes|boolean';
        }

        $request->validate($rules);

        $data = $request->only('fecha', 'hora', 'estado', 'notas', 'notas_medicas');

        if ($this->soportaNoAsistio()) {
            if ($request->has('no_asistio')) {
                $data['no_asistio'] = (bool) $request->no_asistio;
            }

            if ($request->filled('estado') && in_array($request->estado, ['completada', 'cancelada'], true)) {
                $data['no_asistio'] = false;
            }
        }

        $cita->update($data);

        if ($request->has('servicios')) {
            $cita->servicios()->sync($request->servicios);
        }

        if ($cita->paciente && (
            $request->has('paciente_nombre') ||
            $request->has('paciente_email') ||
            $request->has('paciente_telefono')
        )) {
            $updatesPaciente = [];

            if ($request->filled('paciente_nombre')) {
                $updatesPaciente['name'] = $request->paciente_nombre;
            }

            if ($request->has('paciente_email')) {
                $updatesPaciente['email'] = $request->paciente_email;
            }

            if ($request->has('paciente_telefono')) {
                $updatesPaciente['telefono'] = $request->paciente_telefono;
            }

            if (!empty($updatesPaciente)) {
                $cita->paciente->update($updatesPaciente);
            }
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

        // Ingresos últimos 7 días (para gráfico admin)
        $ingresos7dias = [];
        for ($i = 6; $i >= 0; $i--) {
            $dia = now()->subDays($i)->toDateString();
            $total = Cita::where('estado', 'completada')
                ->where('fecha', $dia)
                ->with('servicios')
                ->get()
                ->sum(fn ($c) => $c->servicios->sum('precio'));
            $ingresos7dias[] = [
                'fecha' => now()->subDays($i)->format('d/m'),
                'ingresos' => round($total, 2),
            ];
        }

        // Últimas 5 citas de la clínica
        $ultimasCitas = Cita::with('paciente', 'profesional.especialidad', 'servicios')
            ->whereNotIn('estado', ['cancelada'])
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->limit(5)
            ->get();

        return response()->json([
            'citasHoy' => $citasHoy,
            'citasSemana' => $citasSemana,
            'ingresosTotales' => $ingresosTotales,
            'ingresosSemana' => $ingresosSemana,
            'totalPacientes' => $totalPacientes,
            'ingresos7dias' => $ingresos7dias,
            'ultimasCitas' => $ultimasCitas,
        ]);
    }

    public function dashboardProfesional(Request $request)
    {
        $user = $request->user();
        $profesional = $user->profesional;

        if (!$profesional) {
            return response()->json(['message' => 'Sin perfil profesional'], 404);
        }

        $hoy = now()->toDateString();
        $inicioMes = now()->startOfMonth()->toDateString();
        $finMes = now()->endOfMonth()->toDateString();

        $citasHoy = Cita::where('profesional_id', $profesional->id)
            ->where('fecha', $hoy)
            ->whereNotIn('estado', ['cancelada'])
            ->count();

        $citasPendientes = Cita::where('profesional_id', $profesional->id)
            ->where('estado', 'confirmada')
            ->where('fecha', $hoy)
            ->when($this->soportaNoAsistio(), fn ($q) => $q->where('no_asistio', false))
            ->count();

        $ingresosMes = Cita::where('profesional_id', $profesional->id)
            ->where('estado', 'completada')
            ->whereBetween('fecha', [$inicioMes, $finMes])
            ->with('servicios')
            ->get()
            ->sum(fn ($c) => $c->servicios->sum('precio'));

        $completadasMes = Cita::where('profesional_id', $profesional->id)
            ->where('estado', 'completada')
            ->whereBetween('fecha', [$inicioMes, $finMes])
            ->count();

        // Ingresos últimos 7 días
        $ingresos7dias = [];
        for ($i = 6; $i >= 0; $i--) {
            $dia = now()->subDays($i)->toDateString();
            $total = Cita::where('profesional_id', $profesional->id)
                ->where('estado', 'completada')
                ->where('fecha', $dia)
                ->with('servicios')
                ->get()
                ->sum(fn ($c) => $c->servicios->sum('precio'));
            $ingresos7dias[] = [
                'fecha' => now()->subDays($i)->format('d/m'),
                'ingresos' => round($total, 2),
            ];
        }

        return response()->json([
            'citasHoy' => $citasHoy,
            'citasPendientes' => $citasPendientes,
            'ingresosMes' => $ingresosMes,
            'completadasMes' => $completadasMes,
            'ingresos7dias' => $ingresos7dias,
        ]);
    }

    public function misPacientes(Request $request)
    {
        $profesional = $request->user()->profesional;

        if (!$profesional) {
            return response()->json([], 200);
        }

        $pacienteIds = Cita::where('profesional_id', $profesional->id)
            ->whereNotIn('estado', ['cancelada'])
            ->distinct()
            ->pluck('paciente_id');

        $pacientes = \App\Models\User::whereIn('id', $pacienteIds)
            ->get()
            ->map(function ($p) use ($profesional) {
                $ultimaCita = Cita::where('profesional_id', $profesional->id)
                    ->where('paciente_id', $p->id)
                    ->whereNotIn('estado', ['cancelada'])
                    ->orderByDesc('fecha')
                    ->orderByDesc('hora')
                    ->first();
                $totalCitas = Cita::where('profesional_id', $profesional->id)
                    ->where('paciente_id', $p->id)
                    ->whereNotIn('estado', ['cancelada'])
                    ->count();
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'apellidos' => $p->apellidos,
                    'email' => $p->email,
                    'telefono' => $p->telefono,
                    'totalCitas' => $totalCitas,
                    'ultimaCita' => $ultimaCita?->fecha,
                ];
            });

        // Para demos: si hay pocos pacientes reales con cita, completa la lista
        // con pacientes registrados (sin historial) para que la vista sea util.
        if ($pacientes->count() < 6) {
            $faltan = 6 - $pacientes->count();
            $extras = \App\Models\User::where('role', 'paciente')
                ->whereNotIn('id', $pacienteIds)
                ->orderBy('name')
                ->limit($faltan)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'apellidos' => $p->apellidos,
                    'email' => $p->email,
                    'telefono' => $p->telefono,
                    'totalCitas' => 0,
                    'ultimaCita' => null,
                ]);

            $pacientes = $pacientes->concat($extras);
        }

        return response()->json($pacientes);
    }

    public function fichaPaciente(Request $request, $pacienteId)
    {
        $profesional = $request->user()->profesional;

        if (!$profesional) {
            return response()->json(['message' => 'Sin perfil profesional'], 404);
        }

        $paciente = \App\Models\User::findOrFail($pacienteId);

        $citas = Cita::where('profesional_id', $profesional->id)
            ->where('paciente_id', $pacienteId)
            ->whereNotIn('estado', ['cancelada'])
            ->with('servicios')
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->get()
            ->map(fn ($c) => [
                'id'            => $c->id,
                'fecha'         => $c->fecha,
                'hora'          => $c->hora,
                'estado'        => $c->estado,
                'notas'         => $c->notas,
                'notas_medicas' => $c->notas_medicas,
                'servicios'     => $c->servicios->pluck('nombre'),
            ]);

        return response()->json([
            'paciente' => [
                'id'        => $paciente->id,
                'name'      => $paciente->name,
                'apellidos' => $paciente->apellidos,
                'email'     => $paciente->email,
                'telefono'  => $paciente->telefono,
            ],
            'citas' => $citas,
        ]);
    }

    public function updatePaciente(Request $request, $pacienteId)
    {
        $profesional = $request->user()->profesional;

        if (!$profesional) {
            return response()->json(['message' => 'Sin perfil profesional'], 403);
        }

        $paciente = \App\Models\User::findOrFail($pacienteId);

        if ($paciente->role !== 'paciente') {
            return response()->json(['message' => 'Solo se pueden editar pacientes'], 422);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'apellidos' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $paciente->id,
            'telefono' => ['nullable', 'string', 'max:15', 'regex:/^[0-9+()\- ]{9,15}$/'],
        ], [
            'telefono.max' => 'El telefono no puede superar 15 caracteres.',
            'telefono.regex' => 'El telefono debe tener entre 9 y 15 caracteres validos.',
        ]);

        $paciente->update($data);

        return response()->json([
            'id' => $paciente->id,
            'name' => $paciente->name,
            'apellidos' => $paciente->apellidos,
            'email' => $paciente->email,
            'telefono' => $paciente->telefono,
        ]);
    }
}
