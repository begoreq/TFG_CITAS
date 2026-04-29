# Estado de Entrega - MediCitas

Fecha de revision: 27/04/2026

## 1. Backend completo

### Rutas protegidas
- Proteccion general con `auth:sanctum` en rutas privadas (`/api/citas`, `/api/dashboard`, `/api/me`, `/api/logout`, etc.).
- Proteccion por rol con middleware `role` (`App\Http\Middleware\CheckRole`).
- Rutas de admin protegidas: CRUD de especialidades, profesionales, servicios y gestion de usuarios.
- Rutas de profesional protegidas: `/api/mi-dashboard`, `/api/mis-pacientes`, `/api/ficha-paciente/{id}`.

Evidencia verificada con:
- `php artisan route:list --path=api -v`

### Validaciones implementadas
- `AuthController`: validacion de login y registro (`email`, `password`, confirmacion).
- `CitaController@store`: validacion de campos requeridos, `after_or_equal:today`, servicios obligatorios, bloqueo de domingos, bloqueo de festivos y bloqueo de citas duplicadas por franja.
- `ServicioController`, `ProfesionalController`, `EspecialidadController`, `UserController`: validaciones de tipos, formatos y `exists/unique`.

### Persistencia
- Persistencia en MySQL con migraciones de `users`, `especialidades`, `profesionales`, `servicios`, `citas`, `cita_servicios`.
- Relacion many-to-many de cita con servicios mediante tabla pivote `cita_servicios`.
- Baja logica de cita por cambio de estado a `cancelada`.

## 2. Frontend conectado y funcional

Pantallas conectadas a API:
- Autenticacion: `Login`, `Register`.
- Paciente: `PacienteLayout` (reserva, calendario, mis citas, anulacion).
- Profesional: `ProfesionalLayout` (agenda, cambio de estado, notas medicas, ficha de paciente, dashboard profesional).
- Admin: `Dashboard`, `AdminCalendario`, `AdminServicios`, `AdminPersonal`, `AdminUsuarios`.

Integracion:
- Cliente Axios centralizado en `fronted/src/api.js`.
- Interceptor con token Bearer desde `localStorage`.

Verificacion de compilacion:
- `cd fronted && npm run build` -> build OK.

## 3. Pruebas basicas realizadas

### Pruebas automaticas (backend)
Archivo agregado:
- `backend/tests/Feature/ApiCitasSecurityTest.php`

Cobertura minima incluida:
- 401 en `/api/citas` sin autenticacion.
- 403 en `/api/users` para usuario no admin.
- 422 al intentar reservar una cita en domingo.
- 201 y persistencia correcta al crear cita valida (incluyendo pivote `cita_servicios`).

Ejecucion:
- `runTests` sobre `ApiCitasSecurityTest.php` -> 4/4 OK.
- `runTests` sobre `ApiCitasSecurityTest.php` + `ExampleTest.php` -> 5/5 OK.

Nota de seguridad de datos:
- Los tests de Laravel usan `DB_CONNECTION=sqlite` y `DB_DATABASE=:memory:` en `backend/phpunit.xml`, por lo que no afectan a la BD real.

### Pruebas manuales recomendadas/realizadas para entrega
- Login correcto con `admin`, `profesional` y `paciente`.
- Login fallido con credenciales incorrectas.
- Reserva paciente completa (especialidad -> profesional -> servicios -> fecha/hora).
- Bloqueo de reserva en domingo/festivo.
- Anulacion de cita por paciente.
- Cambio de estado de cita y notas medicas en panel profesional.
- CRUD de servicios/profesionales por admin.
- Cambio de rol de usuario por admin.
- Verificacion de acceso denegado por rol en endpoints protegidos (401/403).
