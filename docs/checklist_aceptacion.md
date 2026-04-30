# Checklist de Aceptacion (TFG)

## 1) Autenticacion y roles

- [ ] Login admin con credenciales validas.
- [ ] Login profesional con credenciales validas.
- [ ] Login paciente con credenciales validas.
- [ ] Login con credenciales invalidas devuelve error.
- [ ] Usuario sin token no puede acceder a rutas privadas (401).
- [ ] Usuario sin rol permitido recibe 403 en rutas restringidas.

## 2) Paciente

- [ ] Puede reservar cita completa (especialidad -> profesional -> servicios -> fecha/hora).
- [ ] No puede reservar en domingo.
- [ ] No puede reservar en festivo nacional.
- [ ] No puede reservar franja solapada con otra cita del profesional.
- [ ] Puede ver "Mis Citas" con estado y coste de la cita.
- [ ] Puede anular una cita y deja de aparecer como activa.

## 3) Profesional

- [ ] Puede ver agenda diaria y cambiar estados de cita.
- [ ] Puede editar datos de paciente desde "Mis Pacientes".
- [ ] Telefono invalido en edicion de paciente muestra error y no guarda.

## 4) Administrador

- [ ] Puede crear/editar/eliminar servicios.
- [ ] No puede guardar servicios con duracion mayor a 120 min.
- [ ] Puede crear/editar/eliminar profesionales.
- [ ] En calendario, filtrar por especialidad muestra solo citas y puntos de esa especialidad.
- [ ] En calendario, al editar cita, guardar telefono del paciente persiste correctamente.
- [ ] Mensajes de error de guardado muestran causa en espanol.

## 5) Calidad tecnica

- [ ] Frontend compila sin errores (`npm run build`).
- [ ] Tests backend pasan en entorno de prueba (`php artisan test`).
- [ ] README incluye pasos de puesta en marcha y credenciales demo.
