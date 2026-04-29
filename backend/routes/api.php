<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspecialidadController;
use App\Http\Controllers\Api\ProfesionalController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\UserController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas públicas de consulta (para que el paciente vea disponibilidad sin token)
Route::get('/especialidades', [EspecialidadController::class, 'index']);
Route::get('/especialidades/{especialidad}', [EspecialidadController::class, 'show']);
Route::get('/profesionales', [ProfesionalController::class, 'index']);
Route::get('/servicios', [ServicioController::class, 'index']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Citas (todos los autenticados)
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{cita}', [CitaController::class, 'show']);
    Route::put('/citas/{cita}', [CitaController::class, 'update']);
    Route::delete('/citas/{cita}', [CitaController::class, 'destroy']);

    // Dashboard (admin y profesional)
    Route::get('/dashboard', [CitaController::class, 'dashboard']);

    // Dashboard profesional
    Route::middleware('role:profesional')->group(function () {
        Route::get('/mi-dashboard', [CitaController::class, 'dashboardProfesional']);
        Route::get('/mis-pacientes', [CitaController::class, 'misPacientes']);
        Route::get('/ficha-paciente/{paciente}', [CitaController::class, 'fichaPaciente']);
        Route::put('/pacientes/{paciente}', [CitaController::class, 'updatePaciente']);
    });

    // Solo admin
    Route::middleware('role:admin')->group(function () {
        // CRUD Especialidades
        Route::post('/especialidades', [EspecialidadController::class, 'store']);
        Route::put('/especialidades/{especialidad}', [EspecialidadController::class, 'update']);
        Route::delete('/especialidades/{especialidad}', [EspecialidadController::class, 'destroy']);

        // CRUD Profesionales
        Route::post('/profesionales', [ProfesionalController::class, 'store']);
        Route::get('/profesionales/{profesional}', [ProfesionalController::class, 'show']);
        Route::put('/profesionales/{profesional}', [ProfesionalController::class, 'update']);
        Route::delete('/profesionales/{profesional}', [ProfesionalController::class, 'destroy']);

        // CRUD Servicios
        Route::post('/servicios', [ServicioController::class, 'store']);
        Route::get('/servicios/{servicio}', [ServicioController::class, 'show']);
        Route::put('/servicios/{servicio}', [ServicioController::class, 'update']);
        Route::delete('/servicios/{servicio}', [ServicioController::class, 'destroy']);

        // Gestión de usuarios
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
    });
});
