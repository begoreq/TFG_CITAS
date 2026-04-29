<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profesional;
use App\Models\Servicio;
use App\Models\Cita;
use App\Models\CitaServicio;

class PacientesYCitasSeeder extends Seeder
{
    public function run(): void
    {
        // ── Pacientes extra ──────────────────────────────────────────────
        $pacientes = [
            User::create([
                'name'      => 'Carlos',
                'apellidos' => 'Martínez Ruiz',
                'email'     => 'carlos@example.com',
                'telefono'  => '611222333',
                'password'  => 'paciente123',
                'role'      => 'paciente',
            ]),
            User::create([
                'name'      => 'Laura',
                'apellidos' => 'Sánchez Mora',
                'email'     => 'laura.s@example.com',
                'telefono'  => '622333444',
                'password'  => 'paciente123',
                'role'      => 'paciente',
            ]),
            User::create([
                'name'      => 'Javier',
                'apellidos' => 'López Fernández',
                'email'     => 'javier@example.com',
                'telefono'  => '633444555',
                'password'  => 'paciente123',
                'role'      => 'paciente',
            ]),
            User::create([
                'name'      => 'Ana',
                'apellidos' => 'Rodríguez Blanco',
                'email'     => 'ana@example.com',
                'telefono'  => '644555666',
                'password'  => 'paciente123',
                'role'      => 'paciente',
            ]),
            User::create([
                'name'      => 'Pedro',
                'apellidos' => 'González Herrera',
                'email'     => 'pedro@example.com',
                'telefono'  => '655666777',
                'password'  => 'paciente123',
                'role'      => 'paciente',
            ]),
        ];

        // María (paciente del seeder base)
        $maria = User::where('email', 'usuario@clinica.com')->first();
        if ($maria) {
            $pacientes[] = $maria;
        }

        // ── Profesionales ────────────────────────────────────────────────
        $aparicio = Profesional::whereHas('user', fn($q) => $q->where('email', 'aparicio@clinica.com'))->first();
        $benitez  = Profesional::whereHas('user', fn($q) => $q->where('email', 'benitez@clinica.com'))->first();
        $mariaFis = Profesional::whereHas('user', fn($q) => $q->where('email', 'maria@clinica.com'))->first();
        $angelFis = Profesional::whereHas('user', fn($q) => $q->where('email', 'angel@clinica.com'))->first();
        $lauraOdo = Profesional::whereHas('user', fn($q) => $q->where('email', 'laura@clinica.com'))->first();
        $sergio   = Profesional::whereHas('user', fn($q) => $q->where('email', 'sergio@clinica.com'))->first();

        // ── Servicios ────────────────────────────────────────────────────
        $consulta    = Servicio::where('nombre', 'Consulta deportiva')->first();
        $valoracion  = Servicio::where('nombre', 'Valoración funcional')->first();
        $sesionFisio = Servicio::where('nombre', 'Sesión Fisioterapia')->first();
        $puncSeca    = Servicio::where('nombre', 'Punción Seca')->first();
        $limpieza    = Servicio::where('nombre', 'Limpieza Bucal')->first();
        $revision    = Servicio::where('nombre', 'Revisión General')->first();
        $terapia     = Servicio::where('nombre', 'Terapia Individual')->first();
        $sesOnline   = Servicio::where('nombre', 'Sesión Online')->first();
        $masaje      = Servicio::where('nombre', 'Masaje Deportivo')->first();

        // ── Citas ────────────────────────────────────────────────────────
        // Formato: [paciente_idx, profesional, fecha, hora, estado, notas, [servicios]]
        $citas = [
            // --- Pasadas (completadas) ---
            [$pacientes[0], $aparicio,  '2026-04-25', '09:00', 'completada', 'Revisión post temporada. Sin lesiones activas.', [$consulta]],
            [$pacientes[1], $mariaFis,  '2026-04-25', '10:00', 'completada', 'Contractura lumbar. Se aplica calor y masaje.', [$sesionFisio]],
            [$pacientes[2], $lauraOdo,  '2026-04-26', '11:30', 'completada', 'Limpieza de rutina. Buen estado general.', [$limpieza]],
            [$pacientes[3], $sergio,    '2026-04-26', '16:00', 'completada', 'Primera sesión. Se trabajan técnicas de relajación.', [$terapia]],
            [$pacientes[4], $angelFis,  '2026-04-27', '09:30', 'completada', 'Punción seca en tríceps sural.', [$puncSeca]],
            [$pacientes[5], $benitez,   '2026-04-28', '10:00', 'completada', 'Valoración pretemporada. Buen estado físico.', [$valoracion]],
            [$pacientes[1], $lauraOdo,  '2026-04-28', '12:00', 'cancelada',  'Paciente no se presentó.', [$revision]],

            // --- Hoy (confirmadas/pendientes) ---
            [$pacientes[0], $mariaFis,  '2026-04-29', '09:00', 'confirmada', null, [$sesionFisio, $masaje]],
            [$pacientes[2], $aparicio,  '2026-04-29', '10:30', 'confirmada', null, [$consulta]],
            [$pacientes[3], $lauraOdo,  '2026-04-29', '12:00', 'pendiente',  null, [$limpieza]],
            [$pacientes[4], $sergio,    '2026-04-29', '17:00', 'pendiente',  null, [$sesOnline]],

            // --- Próximas ---
            [$pacientes[5], $aparicio,  '2026-04-30', '09:00', 'confirmada', null, [$consulta, $valoracion]],
            [$pacientes[1], $angelFis,  '2026-04-30', '11:00', 'pendiente',  null, [$sesionFisio]],
            [$pacientes[0], $sergio,    '2026-05-02', '10:00', 'pendiente',  null, [$terapia]],
            [$pacientes[2], $mariaFis,  '2026-05-02', '12:00', 'pendiente',  null, [$puncSeca]],
            [$pacientes[3], $benitez,   '2026-05-03', '09:30', 'confirmada', null, [$valoracion]],
            [$pacientes[4], $lauraOdo,  '2026-05-04', '11:00', 'pendiente',  null, [$revision, $limpieza]],
            [$pacientes[5], $sergio,    '2026-05-05', '16:00', 'pendiente',  null, [$terapia]],
        ];

        foreach ($citas as [$paciente, $profesional, $fecha, $hora, $estado, $notas, $serviciosCita]) {
            if (!$paciente || !$profesional) {
                continue;
            }

            $cita = Cita::create([
                'paciente_id'    => $paciente->id,
                'profesional_id' => $profesional->id,
                'fecha'          => $fecha,
                'hora'           => $hora,
                'estado'         => $estado,
                'notas'          => $notas,
            ]);

            foreach ($serviciosCita as $servicio) {
                if ($servicio) {
                    CitaServicio::create([
                        'cita_id'     => $cita->id,
                        'servicio_id' => $servicio->id,
                    ]);
                }
            }
        }
    }
}
