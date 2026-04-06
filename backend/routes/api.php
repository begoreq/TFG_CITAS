<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspecialidadController;
use App\Http\Controllers\Api\ProfesionalController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\CitaController;

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

    // CRUD Especialidades (admin)
    Route::post('/especialidades', [EspecialidadController::class, 'store']);
    Route::put('/especialidades/{especialidad}', [EspecialidadController::class, 'update']);
    Route::delete('/especialidades/{especialidad}', [EspecialidadController::class, 'destroy']);

    // CRUD Profesionales (admin)
    Route::post('/profesionales', [ProfesionalController::class, 'store']);
    Route::get('/profesionales/{profesional}', [ProfesionalController::class, 'show']);
    Route::put('/profesionales/{profesional}', [ProfesionalController::class, 'update']);
    Route::delete('/profesionales/{profesional}', [ProfesionalController::class, 'destroy']);

    // CRUD Servicios (admin)
    Route::post('/servicios', [ServicioController::class, 'store']);
    Route::get('/servicios/{servicio}', [ServicioController::class, 'show']);
    Route::put('/servicios/{servicio}', [ServicioController::class, 'update']);
    Route::delete('/servicios/{servicio}', [ServicioController::class, 'destroy']);

    // Citas
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{cita}', [CitaController::class, 'show']);
    Route::put('/citas/{cita}', [CitaController::class, 'update']);
    Route::delete('/citas/{cita}', [CitaController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [CitaController::class, 'dashboard']);
});
