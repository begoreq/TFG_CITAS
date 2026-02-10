# SaludCitas - Gestor de Citas Médicas

Una aplicación web moderna para gestionar citas médicas en clínicas y hospitales.

## Características

- **Login**: Autenticación de usuarios
- **Agenda del Médico**: Visualización de citas programadas
- **Nueva Reserva**: Reserva de nuevas citas médicas
- **Ficha Clínica**: Información detallada del paciente
- **Selección de Horarios**: Grid interactivo de horas disponibles
- **Diseño Responsivo**: Interfaz limpia y profesional

## Tecnologías Utilizadas

- React 19.2.0
- Vite 7.3.1
- CSS Puro (sin frameworks)

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
```bash
cd fronted
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5176/`

## Estructura del Proyecto

```
TFG_CITAS/
├── backend/
├── fronted/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AgendaMedico.jsx
│   │   ├── NuevaReserva.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Pantallas

### 1. Login
Pantalla de autenticación para acceder al sistema.

### 2. Agenda del Médico
Visualiza todas las citas del día con opciones para ver detalles.

### 3. Nueva Cita Médica
Formulario para reservar nuevas citas con:
- Selección de especialidad
- Selección de médico
- Selección de fecha
- Selección de horario

### 4. Ficha Clínica del Paciente
Información completa del paciente incluyendo:
- Datos médicos (peso, altura, tipo de sangre)
- Alergias
- Antecedentes

## Paleta de Colores

- **Turquesa/Cian**: #17a2b8
- **Azul Oscuro**: #2C3E50
- **Gris Claro**: #f8f9fa
- **Rojo (Alergias)**: #dc3545

## Autor

Creado como proyecto de Trabajo Final de Grado (TFG)

## Licencia

Este proyecto está disponible bajo licencia MIT.
