# MediCitas — Sistema Web de Gestión de Citas Médicas

Trabajo de Fin de Grado · CFGS Desarrollo de Aplicaciones Web · CESUR · 2025-2026  
**Autora:** Begoña Requena Atencia

---

## Descripción

MediCitas es una aplicación web genérica de gestión de citas diseñada para centros que necesiten organizar reservas, agendas y disponibilidad de personal. Aunque los ejemplos están orientados al ámbito sanitario, el sistema es adaptable a cualquier sector que trabaje con citas.

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS + Recharts | 19 / 7 |
| Backend | Laravel + PHP | 12 / 8.4 |
| Autenticación | Laravel Sanctum (Bearer Token) | 4 |
| Base de datos | MySQL | 8.0 |
| Infraestructura | Docker + Docker Compose | — |
| Testing | PHPUnit + Postman | — |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
- Puertos `5173`, `8000` y `3307` libres en tu máquina.

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd TFG_CITAS
```

### 2. Levantar la infraestructura

```bash
docker compose up -d --build
```

Esto inicia tres contenedores:

| Contenedor | Descripción | Puerto |
|---|---|---|
| `medicitas_frontend` | React + Vite | `5173` |
| `medicitas_backend` | Laravel + PHP-FPM | `8000` |
| `medicitas_db` | MySQL 8.0 | `3307` |

### 3. Instalar dependencias del backend

```bash
docker exec -it medicitas_backend composer install
```

### 4. Preparar la base de datos

```bash
docker exec -it medicitas_backend php artisan migrate --seed
```

Esto ejecuta todas las migraciones y carga los datos iniciales:
- 1 administrador
- 6 profesionales de distintas especialidades
- Servicios y especialidades de ejemplo
- Citas de prueba

### 5. Acceder a la aplicación

| Recurso | URL |
|---|---|
| **Aplicación web** | http://localhost:5173 |
| **API REST** | http://localhost:8000/api |

### 6. Demo rápida (5 minutos)

1. Inicia sesión como admin y verifica dashboard + calendario.
2. Crea un servicio y valida que no permita duración > 120 minutos.
3. En calendario admin, edita una cita y cambia teléfono del paciente.
4. Inicia sesión como profesional y revisa "Mis Pacientes".
5. Inicia sesión como paciente y reserva una cita completa.
6. Comprueba "Mis Citas" y anula una cita.

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@clinica.com | admin123 |
| Profesional | aparicio@clinica.com | password123 |
| Paciente | usuario@clinica.com | usuario123 |

---

## Funcionalidades por rol

### Administrador
- Dashboard con KPIs (citas hoy, ingresos semana/total, pacientes) y gráfico de ingresos 7 días.
- Calendario mensual interactivo con filtros por especialidad y gestión de citas (crear, editar, eliminar).
- CRUD de servicios, especialidades y profesionales.
- Gestión de usuarios con cambio de rol.

### Profesional
- Agenda diaria y calendario mensual con indicadores de citas.
- Atención de citas con registro de notas médicas.
- Lista de pacientes con buscador y acceso a ficha clínica.

### Paciente
- Reserva de cita en 3 pasos: especialidad → profesional + servicios → fecha y hora.
- Bloqueo automático de domingos, festivos y horas ocupadas.
- Consulta y cancelación de citas propias.

---

## Estructura del proyecto

```
TFG_CITAS/
├── backend/                  # Laravel API
│   ├── app/Http/Controllers/Api/   # 6 controladores (Auth, Cita, Especialidad, Profesional, Servicio, User)
│   ├── app/Http/Middleware/        # CheckRole.php
│   ├── routes/api.php              # 30 endpoints
│   ├── database/migrations/        # Migraciones
│   └── database/seeders/           # Datos iniciales
├── fronted/                  # React SPA
│   └── src/
│       ├── pages/            # AdminLayout, ProfesionalLayout, PacienteLayout
│       ├── App.jsx           # Enrutamiento por roles
│       └── api.js            # Cliente Axios con interceptor de token
├── postman/                  # Colección y entorno Postman
│   ├── MediCitas_API.postman_collection.json
│   └── MediCitas_Local.postman_environment.json
└── docker-compose.yml
```

---

## API REST

La API expone **30 endpoints** organizados en tres niveles de acceso:

| Nivel | Protección | Ejemplos |
|---|---|---|
| Público | Sin token | `POST /api/login`, `POST /api/register`, `GET /api/especialidades` |
| Autenticado | `auth:sanctum` | `GET /api/citas`, `POST /api/citas`, `DELETE /api/citas/{id}` |
| Por rol | `auth:sanctum` + `CheckRole` | `GET /api/dashboard`, `GET /api/mi-dashboard`, `PATCH /api/users/{id}/role` |

### Códigos de respuesta

| Código | Situación |
|---|---|
| `200` | Consulta correcta |
| `201` | Recurso creado |
| `401` | Sin token o token inválido |
| `403` | Rol sin permisos |
| `422` | Error de validación (ej. reserva en domingo o cita solapada) |

---

## Testing

### Pruebas automatizadas (PHPUnit)

```bash
docker exec -it medicitas_backend php artisan test
```

Cubre cuatro casos sobre SQLite en memoria:
- Acceso sin autenticación → `401`
- Acceso con rol incorrecto → `403`
- Reserva en día no laborable → `422`
- Creación de cita válida → `201`

### Pruebas con Postman

Importa los archivos de la carpeta `postman/` en Postman:
1. `MediCitas_API.postman_collection.json` — 30 peticiones en 8 carpetas.
2. `MediCitas_Local.postman_environment.json` — Variables de entorno preconfiguradas.

Los scripts de la colección capturan y guardan el token automáticamente tras el login.

### Checklist de aceptación

Consulta el checklist completo en `docs/checklist_aceptacion.md`.

### Limitaciones y mejoras futuras

Consulta la propuesta en `docs/limitaciones_y_mejoras_futuras.md`.

---

## Comandos útiles

```bash
# Ver estado de migraciones
docker exec -it medicitas_backend php artisan migrate:status

# Revertir y volver a migrar con datos (¡borra datos!)
docker exec -it medicitas_backend php artisan migrate:fresh --seed

# Ver logs del backend
docker logs medicitas_backend

# Parar todos los contenedores
docker compose down
```

---

## Licencia

Proyecto educativo — TFG CESUR 2025-2026. Uso académico.
