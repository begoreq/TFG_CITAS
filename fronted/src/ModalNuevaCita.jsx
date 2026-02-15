import React, { useState } from 'react';

// Servicios y precios por especialidad
const serviciosPorEspecialidad = {
  'Medicina Deportiva': [
    { nombre: 'Consulta deportiva', precio: '40€' },
    { nombre: 'Valoración funcional', precio: '55€' },
    { nombre: 'Plan entrenamiento', precio: '60€' }
  ],
  'Fisioterapia': [
    { nombre: 'Sesión Fisioterapia', precio: '60€' },
    { nombre: 'Punción Seca', precio: '65€' },
    { nombre: 'Vendaje Neuromuscular', precio: '30€' },
    { nombre: 'Masaje Deportivo', precio: '55€' }
  ],
  'Odontología': [
    { nombre: 'Limpieza Bucal', precio: '55€' },
    { nombre: 'Revisión General', precio: '40€' },
    { nombre: 'Blanqueamiento', precio: '180€' },
    { nombre: 'Empaste', precio: '65€' }
  ],
  'Psicología': [
    { nombre: 'Terapia Individual', precio: '70€' },
    { nombre: 'Terapia de Pareja', precio: '100€' },
    { nombre: 'Sesión Online', precio: '60€' },
    { nombre: 'Evaluación Inicial', precio: '85€' }
  ]
};
const profesionalesPorEspecialidad = {
  'Medicina Deportiva': [
    'Dr. Aparicio', 'Dra. Benitez'
  ],
  'Fisioterapia': [
    'Maria', 'Angel'
  ],
  'Odontología': [
    'Dra. Laura Gómez'
  ],
  'Psicología': [
    'Dr. Sergio Díaz'
  ]
};
const horas = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00',
];

export default function ModalNuevaCita({ fecha, especialidad, onClose, onCrear }) {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    servicio: '',
    profesional: '',
    fecha: fecha || '',
    hora: '',
    estado: 'Confirmada',
    notas: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onCrear && onCrear(form);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6">Nueva Cita Médica</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre del Paciente *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: María García López" className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Teléfono *</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="+34 600 000 000" className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          {especialidad && (
            <>
              <div>
                <label className="block font-semibold mb-1">Servicio *</label>
                <select name="servicio" value={form.servicio} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-gray-50">
                  <option value="">Seleccionar servicio</option>
                  {serviciosPorEspecialidad[especialidad]?.map(s => (
                    <option key={s.nombre} value={s.nombre}>{s.nombre} ({s.precio})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Personal *</label>
                <select name="profesional" value={form.profesional} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-gray-50">
                  <option value="">Seleccionar profesional</option>
                  {profesionalesPorEspecialidad[especialidad]?.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Fecha *</label>
              <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hora *</label>
              <select name="hora" value={form.hora} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-gray-50">
                <option value="">Seleccionar hora</option>
                {horas.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Estado</label>
            <input name="estado" value={form.estado} readOnly className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas adicionales sobre la cita..." className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded border border-gray-300 bg-white font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700">Crear Reserva</button>
          </div>
        </form>
      </div>
    </div>
  );
}
