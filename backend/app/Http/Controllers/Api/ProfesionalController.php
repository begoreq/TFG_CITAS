<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profesional;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfesionalController extends Controller
{
    public function index()
    {
        return Profesional::with('especialidad', 'user')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'telefono' => 'nullable|string|max:20',
            'especialidad_id' => 'required|exists:especialidades,id',
        ]);

        $user = User::create([
            'name' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'password' => Hash::make('password123'),
            'role' => 'profesional',
        ]);

        $profesional = Profesional::create([
            'user_id' => $user->id,
            'especialidad_id' => $request->especialidad_id,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'telefono' => $request->telefono,
        ]);

        return response()->json($profesional->load('especialidad', 'user'), 201);
    }

    public function show(Profesional $profesional)
    {
        return $profesional->load('especialidad', 'user');
    }

    public function update(Request $request, Profesional $profesional)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'apellidos' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'especialidad_id' => 'sometimes|exists:especialidades,id',
        ]);

        $profesional->update($request->only('nombre', 'apellidos', 'telefono', 'especialidad_id'));

        if ($profesional->user) {
            $profesional->user->update([
                'name' => $request->nombre ?? $profesional->user->name,
                'apellidos' => $request->apellidos ?? $profesional->user->apellidos,
                'telefono' => $request->telefono ?? $profesional->user->telefono,
            ]);
        }

        return response()->json($profesional->load('especialidad', 'user'));
    }

    public function destroy(Profesional $profesional)
    {
        if ($profesional->user) {
            $profesional->user->delete();
        }
        $profesional->delete();

        return response()->json(['message' => 'Profesional eliminado correctamente']);
    }
}
