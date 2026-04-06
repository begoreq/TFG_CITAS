<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especialidad;
use App\Models\Profesional;
use App\Models\Servicio;
use Illuminate\Support\Facades\Hash;

class DatosInicialesSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@clinica.com',
            'password' => 'admin123',
            'role' => 'admin',
        ]);

        // Paciente de ejemplo
        User::create([
            'name' => 'María',
            'apellidos' => 'García López',
            'email' => 'usuario@clinica.com',
            'telefono' => '666123456',
            'password' => 'usuario123',
            'role' => 'paciente',
        ]);

        // Especialidades
        $medDep = Especialidad::create(['nombre' => 'Medicina Deportiva', 'icono' => '🏃‍♂️', 'color' => '#22c55e']);
        $fisio = Especialidad::create(['nombre' => 'Fisioterapia', 'icono' => '🦴', 'color' => '#2563eb']);
        $odonto = Especialidad::create(['nombre' => 'Odontología', 'icono' => '🦷', 'color' => '#fbbf24']);
        $psico = Especialidad::create(['nombre' => 'Psicología', 'icono' => '🧠', 'color' => '#f472b6']);

        // Profesionales (con su usuario asociado)
        $professionals = [
            ['nombre' => 'Dr. Aparicio', 'email' => 'aparicio@clinica.com', 'especialidad' => $medDep],
            ['nombre' => 'Dra. Benitez', 'email' => 'benitez@clinica.com', 'especialidad' => $medDep],
            ['nombre' => 'María', 'apellidos' => 'Fisioterapeuta', 'email' => 'maria@clinica.com', 'especialidad' => $fisio],
            ['nombre' => 'Ángel', 'apellidos' => 'Fisioterapeuta', 'email' => 'angel@clinica.com', 'especialidad' => $fisio],
            ['nombre' => 'Dra. Laura Gómez', 'email' => 'laura@clinica.com', 'especialidad' => $odonto],
            ['nombre' => 'Dr. Sergio Díaz', 'email' => 'sergio@clinica.com', 'especialidad' => $psico],
        ];

        foreach ($professionals as $p) {
            $user = User::create([
                'name' => $p['nombre'],
                'apellidos' => $p['apellidos'] ?? null,
                'email' => $p['email'],
                'password' => 'password123',
                'role' => 'profesional',
            ]);

            Profesional::create([
                'user_id' => $user->id,
                'especialidad_id' => $p['especialidad']->id,
                'nombre' => $p['nombre'],
                'apellidos' => $p['apellidos'] ?? null,
            ]);
        }

        // Servicios
        $servicios = [
            ['nombre' => 'Consulta deportiva', 'precio' => 40, 'duracion_minutos' => 30, 'especialidad_id' => $medDep->id],
            ['nombre' => 'Valoración funcional', 'precio' => 55, 'duracion_minutos' => 45, 'especialidad_id' => $medDep->id],
            ['nombre' => 'Plan entrenamiento', 'precio' => 60, 'duracion_minutos' => 60, 'especialidad_id' => $medDep->id],
            ['nombre' => 'Sesión Fisioterapia', 'precio' => 60, 'duracion_minutos' => 45, 'especialidad_id' => $fisio->id],
            ['nombre' => 'Punción Seca', 'precio' => 65, 'duracion_minutos' => 30, 'especialidad_id' => $fisio->id],
            ['nombre' => 'Vendaje Neuromuscular', 'precio' => 30, 'duracion_minutos' => 20, 'especialidad_id' => $fisio->id],
            ['nombre' => 'Masaje Deportivo', 'precio' => 55, 'duracion_minutos' => 45, 'especialidad_id' => $fisio->id],
            ['nombre' => 'Limpieza Bucal', 'precio' => 55, 'duracion_minutos' => 30, 'especialidad_id' => $odonto->id],
            ['nombre' => 'Revisión General', 'precio' => 40, 'duracion_minutos' => 20, 'especialidad_id' => $odonto->id],
            ['nombre' => 'Blanqueamiento', 'precio' => 180, 'duracion_minutos' => 60, 'especialidad_id' => $odonto->id],
            ['nombre' => 'Empaste', 'precio' => 65, 'duracion_minutos' => 30, 'especialidad_id' => $odonto->id],
            ['nombre' => 'Terapia Individual', 'precio' => 70, 'duracion_minutos' => 50, 'especialidad_id' => $psico->id],
            ['nombre' => 'Terapia de Pareja', 'precio' => 100, 'duracion_minutos' => 75, 'especialidad_id' => $psico->id],
            ['nombre' => 'Sesión Online', 'precio' => 60, 'duracion_minutos' => 50, 'especialidad_id' => $psico->id],
            ['nombre' => 'Evaluación Inicial', 'precio' => 85, 'duracion_minutos' => 60, 'especialidad_id' => $psico->id],
        ];

        foreach ($servicios as $s) {
            Servicio::create($s);
        }
    }
}
