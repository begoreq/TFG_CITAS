# Diario de Desarrollo — MediCitas

## Fase 1: Diseño (documentación previa)
- Se definió la arquitectura cliente-servidor desacoplada (React + Laravel)
- Se diseñó el modelo ER con 7 entidades: User, Especialidad, Profesional, Servicio, Cita, CitaServicio
- Se planificaron las rutas de la API REST y el mapa de navegación
- Se crearon wireframes de alta fidelidad con Figma y luego en React con Tailwind

## Fase 2: Frontend inicial
- Se creó el proyecto con Vite + React
- Se configuró Tailwind CSS para el estilado
- Se desarrollaron las pantallas de login, selección de especialidad, profesionales, calendario y dashboard admin
- **Dificultad:** El componente App.jsx creció demasiado (~900 líneas), mezclando lógica de admin y paciente en un solo archivo con estilos inline. Decisión: mantenerlo funcional para luego refactorizar.

## Fase 3: Backend Laravel
- Se creó el proyecto Laravel desde cero con `composer create-project`
- Se instaló Laravel Sanctum para autenticación por tokens
- Se crearon migraciones para todas las entidades del ER
- Se implementaron los modelos con relaciones Eloquent:
  - User hasMany Cita, hasOne Profesional
  - Especialidad hasMany Profesional, hasMany Servicio
  - Profesional belongsTo User, belongsTo Especialidad, hasMany Cita
  - Cita belongsToMany Servicio (tabla intermedia cita_servicios)
- Se crearon controladores API con CRUD completo para Servicios, Profesionales, Especialidades y Citas
- Se implementó un endpoint /api/dashboard con métricas calculadas
- Se creó un seeder con datos iniciales (admin, paciente, 4 especialidades, 6 profesionales, 15 servicios)
- **Dificultad:** Configurar CORS para que el frontend (puerto 5173) se comunicara con el backend (puerto 8000). Se resolvió con middleware personalizado y configuración de Sanctum.

## Fase 4: Refactorización del Frontend
- Se dividió App.jsx en componentes modulares organizados en /pages/
- Se creó api.js como cliente centralizado con Axios e interceptor de tokens
- Se eliminó todo el código hardcodeado y se conectó a la API real
- **Componentes creados:**
  - Login.jsx: autenticación con Sanctum
  - AdminLayout.jsx: sidebar + navegación por tabs
  - Dashboard.jsx: KPIs conectados al endpoint /api/dashboard
  - AdminServicios.jsx: CRUD completo de servicios con formulario y tabla
  - AdminPersonal.jsx: CRUD completo de profesionales con tarjetas
  - AdminCalendario.jsx: calendario mensual con filtros por especialidad
  - PacienteLayout.jsx: flujo de reserva en 3 pasos (especialidad → profesional → calendario)
- **Decisión técnica:** Se usó Tailwind CSS consistentemente en vez de estilos inline para mantener coherencia y responsive design.

## Fase 5: Docker y despliegue
- Se creó docker-compose.yml con servicios para MySQL, backend y frontend
- Se añadieron Dockerfiles para backend (PHP-CLI + Composer) y frontend (Node)
- Para desarrollo local se mantuvo SQLite como base de datos por simplicidad

## Decisiones técnicas clave
1. **SQLite para desarrollo:** Más sencillo que montar MySQL localmente. Docker usa MySQL para producción.
2. **Sanctum con tokens (no SPA auth):** Más simple para una API REST pura y compatible con cualquier cliente.
3. **Componentes modulares:** Cada página del admin es un componente independiente con su propio estado y llamadas API.
4. **Validación en servidor:** Todos los controladores validan los datos de entrada con las reglas de Laravel.
5. **Protección contra solapamiento:** El endpoint de creación de citas comprueba que no exista otra cita del mismo profesional en la misma fecha y hora.
