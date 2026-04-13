<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profesional;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::with('profesional.especialidad')->orderBy('role')->orderBy('name')->get();
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,profesional,paciente',
        ]);

        $oldRole = $user->role;
        $newRole = $request->role;

        // Si cambia de profesional a otro rol, eliminar perfil profesional
        if ($oldRole === 'profesional' && $newRole !== 'profesional') {
            Profesional::where('user_id', $user->id)->delete();
        }

        $user->update(['role' => $newRole]);

        return response()->json($user->load('profesional.especialidad'));
    }
}
