# Frontend — MediCitas

Capa de presentación de MediCitas, desarrollada con React 19 + Vite + Tailwind CSS.

## Estructura

```
src/
├── pages/          # Layouts por rol (AdminLayout, ProfesionalLayout, PacienteLayout)
├── App.jsx         # Enrutamiento basado en roles
├── api.js          # Cliente Axios con interceptor Bearer Token
├── ModalNuevaCita.jsx
└── ...componentes reutilizables
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Build de producción en `/dist` |

## Tecnologías

- React 19 · Vite · Tailwind CSS · Axios · Recharts
