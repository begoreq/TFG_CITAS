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
1. **Sanctum con tokens (no SPA auth):** Inicialmente se configuró `statefulApi()` en Sanctum, lo que activaba verificación CSRF para peticiones desde localhost. Esto bloqueaba el login desde el navegador. Se eliminó `statefulApi()` para usar autenticación puramente por Bearer token, más simple y compatible con una API REST pura.
2. **Componentes modulares:** Cada página del admin es un componente independiente con su propio estado y llamadas API. PacienteLayout gestiona un flujo de 3 pasos con estado local.
3. **Validación en servidor:** Todos los controladores validan los datos de entrada con las reglas de Laravel.
4. **Protección contra solapamiento:** El endpoint de creación de citas comprueba que no exista otra cita del mismo profesional en la misma fecha y hora.
5. **Docker con 3 servicios:** MySQL (db), backend Laravel (PHP-CLI) y frontend React (Node), comunicados en red interna Docker.

## Fase 6: Corrección de bugs y mejoras
- **Bug CSRF resuelto:** Al pulsar los botones de acceso rápido (admin/paciente) no se entraba. La causa era que `$middleware->statefulApi()` en `bootstrap/app.php` activaba la verificación CSRF de Sanctum para peticiones desde `localhost`. Como el frontend envía el header `Origin: http://localhost:5173`, Sanctum lo detectaba como dominio "stateful" y exigía un token CSRF que nunca se enviaba. Solución: eliminar `statefulApi()` y usar solo Bearer tokens.
- **Bug del calendario (días desalineados):** El array `SEMANA` empezaba por `'dom'` pero el cálculo de celdas vacías usaba fórmula ISO (lunes primero), haciendo que los días cayeran en la columna incorrecta. Corregido poniendo `SEMANA = ['lun', ..., 'dom']`.
- **Calendario Admin mejorado (estilo Fresha):**
  - Dots de color por especialidad debajo de cada día: cada punto indica una especialidad con cita ese día.
  - Leyenda de colores debajo del calendario.
  - Panel lateral fijo con el detalle de citas al pulsar un día (hora, paciente, profesional, servicios, estado), con border-left del color de la especialidad.
  - Filtros de especialidad tipo pill con nombre + icono y toggle on/off.
  - Navegación entre meses con flechas y botón "Hoy".
- **Calendario Paciente mejorado:** navegación entre meses y fecha legible (ej. "lunes, 6 de abril") en vez del formato ISO crudo.
- **Highlight de "hoy" corregido:** el día actual solo se resalta en azul cuando estás viendo el mes correspondiente, no siempre el día N de cualquier mes.

## Dificultades encontradas
| Problema | Causa | Solución |
|---|---|---|
| Botones de login no funcionan desde el navegador | `statefulApi()` activaba CSRF para `localhost` | Eliminar `statefulApi()`, usar solo Bearer tokens |
| Días del calendario en columnas incorrectas | Array SEMANA empezaba en domingo pero offset calculado para lunes | Reordenar SEMANA a `['lun',...,'dom']` |
| Solo se ve el mes actual en calendarios | Variables `year`/`month` fijas a `new Date()` | Añadir estado `mesVista` con navegación |
| Fecha mostrada como `2026-04-06` en selector de horas | Se imprimía la string ISO directamente | Usar `toLocaleDateString('es-ES', {...})` |
