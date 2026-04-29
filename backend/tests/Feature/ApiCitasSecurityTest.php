<?php

namespace Tests\Feature;

use App\Models\Especialidad;
use App\Models\Profesional;
use App\Models\Servicio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiCitasSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_citas_requires_authentication(): void
    {
        $response = $this->getJson('/api/citas');

        $response->assertStatus(401);
    }

    public function test_admin_route_is_forbidden_for_non_admin_users(): void
    {
        $paciente = User::factory()->create([
            'role' => 'paciente',
        ]);

        Sanctum::actingAs($paciente);

        $response = $this->getJson('/api/users');

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'No autorizado',
            ]);
    }

    public function test_store_cita_rejects_sunday_reservations(): void
    {
        $paciente = User::factory()->create(['role' => 'paciente']);
        $profesional = $this->crearProfesional();
        $servicio = $this->crearServicio($profesional->especialidad_id);

        Sanctum::actingAs($paciente);

        $fechaDomingo = Carbon::now()->next(Carbon::SUNDAY)->toDateString();

        $response = $this->postJson('/api/citas', [
            'paciente_id' => $paciente->id,
            'profesional_id' => $profesional->id,
            'fecha' => $fechaDomingo,
            'hora' => '10:00',
            'servicios' => [$servicio->id],
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'No se pueden reservar citas en domingo',
            ]);
    }

    public function test_store_cita_persists_record_and_pivot_services(): void
    {
        $paciente = User::factory()->create(['role' => 'paciente']);
        $profesional = $this->crearProfesional();
        $servicio1 = $this->crearServicio($profesional->especialidad_id, 'Consulta general');
        $servicio2 = $this->crearServicio($profesional->especialidad_id, 'Electrocardiograma');

        Sanctum::actingAs($paciente);

        $fechaLaborable = $this->proximaFechaLaborable();

        $response = $this->postJson('/api/citas', [
            'paciente_id' => $paciente->id,
            'profesional_id' => $profesional->id,
            'fecha' => $fechaLaborable,
            'hora' => '11:00',
            'servicios' => [$servicio1->id, $servicio2->id],
            'notas' => 'Primera visita',
        ]);

        $response->assertCreated();

        $citaId = $response->json('id');

        $this->assertDatabaseHas('citas', [
            'id' => $citaId,
            'paciente_id' => $paciente->id,
            'profesional_id' => $profesional->id,
            'fecha' => $fechaLaborable,
            'hora' => '11:00',
            'estado' => 'confirmada',
        ]);

        $this->assertDatabaseHas('cita_servicios', [
            'cita_id' => $citaId,
            'servicio_id' => $servicio1->id,
        ]);

        $this->assertDatabaseHas('cita_servicios', [
            'cita_id' => $citaId,
            'servicio_id' => $servicio2->id,
        ]);
    }

    private function crearProfesional(): Profesional
    {
        $especialidad = Especialidad::create([
            'nombre' => 'Cardiologia',
            'icono' => 'cardio',
            'color' => '#2563eb',
        ]);

        $userProfesional = User::factory()->create([
            'role' => 'profesional',
            'name' => 'Dr. Prueba',
        ]);

        return Profesional::create([
            'user_id' => $userProfesional->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Dr. Prueba',
            'apellidos' => 'Apellido',
            'telefono' => '600000000',
        ]);
    }

    private function crearServicio(int $especialidadId, string $nombre = 'Consulta'): Servicio
    {
        return Servicio::create([
            'nombre' => $nombre,
            'descripcion' => 'Servicio de prueba',
            'precio' => 50,
            'duracion_minutos' => 30,
            'especialidad_id' => $especialidadId,
        ]);
    }

    private function proximaFechaLaborable(): string
    {
        $fecha = Carbon::tomorrow();

        while ($fecha->isSunday() || $this->esFestivoNacional($fecha)) {
            $fecha->addDay();
        }

        return $fecha->toDateString();
    }

    private function esFestivoNacional(Carbon $fecha): bool
    {
        $y = $fecha->year;
        $festivos = [
            "$y-01-01", "$y-01-06", "$y-05-01", "$y-08-15",
            "$y-10-12", "$y-11-01", "$y-12-06", "$y-12-08", "$y-12-25",
        ];

        return in_array($fecha->toDateString(), $festivos, true);
    }
}
