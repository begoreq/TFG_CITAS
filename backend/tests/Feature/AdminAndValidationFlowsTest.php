<?php

namespace Tests\Feature;

use App\Models\Cita;
use App\Models\Especialidad;
use App\Models\Profesional;
use App\Models\Servicio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAndValidationFlowsTest extends TestCase
{
    use RefreshDatabase;

    public function test_profesional_cannot_update_patient_with_invalid_phone(): void
    {
        $especialidad = $this->crearEspecialidad();

        $userProfesional = User::factory()->create([
            'role' => 'profesional',
            'name' => 'Profesional Demo',
        ]);

        Profesional::create([
            'user_id' => $userProfesional->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Profesional Demo',
            'apellidos' => 'Prueba',
            'telefono' => '600111222',
        ]);

        $paciente = User::factory()->create([
            'role' => 'paciente',
            'email' => 'paciente1@example.com',
        ]);

        Sanctum::actingAs($userProfesional);

        $response = $this->putJson('/api/pacientes/' . $paciente->id, [
            'name' => 'Paciente Editado',
            'apellidos' => 'Apellido',
            'email' => 'paciente1@example.com',
            'telefono' => 'abc1234',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['telefono']);
    }

    public function test_admin_update_cita_persists_patient_phone(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $especialidad = $this->crearEspecialidad();

        $userProfesional = User::factory()->create(['role' => 'profesional']);
        $profesional = Profesional::create([
            'user_id' => $userProfesional->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Dr. Admin',
            'apellidos' => 'Test',
            'telefono' => '600222333',
        ]);

        $paciente = User::factory()->create([
            'role' => 'paciente',
            'telefono' => '600333444',
        ]);

        $cita = Cita::create([
            'paciente_id' => $paciente->id,
            'profesional_id' => $profesional->id,
            'fecha' => now()->addDay()->toDateString(),
            'hora' => '10:00',
            'estado' => 'confirmada',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->putJson('/api/citas/' . $cita->id, [
            'paciente_telefono' => '611223344',
        ]);

        $response->assertOk()
            ->assertJsonPath('paciente.telefono', '611223344');

        $this->assertDatabaseHas('users', [
            'id' => $paciente->id,
            'telefono' => '611223344',
        ]);
    }

    public function test_admin_cannot_create_service_with_duration_over_120_minutes(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $especialidad = $this->crearEspecialidad();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/servicios', [
            'nombre' => 'Servicio Largo',
            'descripcion' => 'Prueba de validacion',
            'precio' => 80,
            'duracion_minutos' => 121,
            'especialidad_id' => $especialidad->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['duracion_minutos']);
    }

    public function test_profesional_list_marks_overdue_confirmed_appointment_as_no_show(): void
    {
        Carbon::setTestNow('2026-04-30 12:30:00');

        $especialidad = $this->crearEspecialidad();

        $userProfesional = User::factory()->create(['role' => 'profesional']);
        $profesional = Profesional::create([
            'user_id' => $userProfesional->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Dr. No Show',
            'apellidos' => 'Test',
            'telefono' => '611000111',
        ]);

        $paciente = User::factory()->create(['role' => 'paciente']);

        $cita = Cita::create([
            'paciente_id' => $paciente->id,
            'profesional_id' => $profesional->id,
            'fecha' => now()->toDateString(),
            'hora' => '10:00',
            'estado' => 'confirmada',
            'no_asistio' => false,
        ]);

        Sanctum::actingAs($userProfesional);

        $response = $this->getJson('/api/citas?profesional_id=' . $profesional->id . '&fecha=' . now()->toDateString());

        $response->assertOk()
            ->assertJsonPath('0.id', $cita->id)
            ->assertJsonPath('0.no_asistio', true);

        $this->assertDatabaseHas('citas', [
            'id' => $cita->id,
            'no_asistio' => true,
        ]);

        Carbon::setTestNow();
    }

    private function crearEspecialidad(): Especialidad
    {
        return Especialidad::create([
            'nombre' => 'Especialidad Test',
            'icono' => 'icon-test',
            'color' => '#2563eb',
        ]);
    }
}
