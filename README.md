# MediCitas - Sistema de Gestión de Citas Médicas

Aplicación web de gestión de citas genérica, diseñada para adaptarse a cualquier empresa que necesite organizar reservas, agendas y disponibilidad del personal.

## Tecnologías

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Laravel 13 (PHP) + API REST
- **Base de datos:** SQLite (desarrollo) / MySQL (producción con Docker)
- **Autenticación:** Laravel Sanctum (tokens)
- **Contenedores:** Docker + Docker Compose

## Estructura del proyecto

```
TFG_CITAS/
├── backend/              # API REST Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Controladores CRUD
│   │   └── Models/                 # Modelos Eloquent
│   ├── database/
│   │   ├── migrations/             # Migraciones de BD
│   │   └── seeders/                # Datos iniciales
│   └── routes/api.php              # Rutas de la API
├── fronted/              # SPA React
│   └── src/
│       ├── api.js                  # Cliente Axios
│       ├── App.jsx                 # Enrutamiento principal
│       └── pages/                  # Páginas/componentes
│           ├── Login.jsx
│           ├── AdminLayout.jsx
│           ├── Dashboard.jsx
│           ├── AdminServicios.jsx
│           ├── AdminPersonal.jsx
│           ├── AdminCalendario.jsx
│           └── PacienteLayout.jsx
├── docker-compose.yml    # Orquestación Docker
└── DIARIO.md             # Diario de desarrollo
```

## Instalación y puesta en marcha

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

El backend estará en `http://localhost:8000`.

### 2. Frontend

```bash
cd fronted
npm install
npm run dev
```

El frontend estará en `http://localhost:5173`.

### 3. Credenciales de prueba

| Rol       | Email               | Contraseña |
|-----------|---------------------|------------|
| Admin     | admin@clinica.com   | admin123   |
| Paciente  | usuario@clinica.com | usuario123 |

## Uso con Docker

```bash
docker-compose up --build
```

## Endpoints principales de la API

| Método | Ruta                     | Descripción              | Auth |
|--------|--------------------------|--------------------------|------|
| POST   | /api/login               | Iniciar sesión           | No   |
| POST   | /api/register            | Registrar paciente       | No   |
| GET    | /api/especialidades      | Listar especialidades    | No   |
| GET    | /api/servicios           | Listar servicios         | No   |
| GET    | /api/profesionales       | Listar profesionales     | No   |
| GET    | /api/citas               | Listar citas             | Sí   |
| POST   | /api/citas               | Crear cita               | Sí   |
| PUT    | /api/citas/{id}          | Modificar cita           | Sí   |
| DELETE | /api/citas/{id}          | Cancelar cita            | Sí   |
| GET    | /api/dashboard           | Métricas dashboard       | Sí   |
| POST   | /api/servicios           | Crear servicio           | Sí   |
| PUT    | /api/servicios/{id}      | Editar servicio          | Sí   |
| DELETE | /api/servicios/{id}      | Eliminar servicio        | Sí   |
| POST   | /api/profesionales       | Crear profesional        | Sí   |
| PUT    | /api/profesionales/{id}  | Editar profesional       | Sí   |
| DELETE | /api/profesionales/{id}  | Eliminar profesional     | Sí   |

## Roles del sistema

- **Administrador:** Gestión total (servicios, personal, calendario, dashboard)
- **Paciente:** Reserva, consulta y cancelación de sus citas

## Pantallas

### Paciente
1. **Login** — Autenticación con email y contraseña
2. **Selección de especialidad** — Medicina Deportiva, Fisioterapia, Odontología, Psicología
3. **Profesional y servicios** — Selección de profesional y carrito de servicios
4. **Calendario** — Selección de fecha y hora para confirmar la cita
5. **Mis Citas** — Listado de citas con opción de anulación

### Administrador
1. **Dashboard** — KPIs de la clínica (citas, ingresos, pacientes)
2. **Calendario** — Agenda con filtros por especialidad
3. **Servicios** — CRUD completo de servicios
4. **Personal** — CRUD completo de profesionales

## Autora

Begoña Requena Atencia — TFG DAW (CESUR)
