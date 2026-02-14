
import React, { useState } from 'react';
import CalendarReserva from './CalendarReserva.jsx';

export default function App() {
    const [citaCancelada, setCitaCancelada] = useState(false);

    const handleCancelarCita = () => {
      setAgenda(prev => prev.slice(0, -1));
      setStepReserva(0);
      setProfesionalSeleccionado('');
      setCitaCancelada(true);
      setTimeout(() => {
        setCitaCancelada(false);
      }, 2000);
    };
  const [showHistoria, setShowHistoria] = useState(false);
  const [historiaActual, setHistoriaActual] = useState(null);
  const [agenda, setAgenda] = useState([
        {
          hora: '09:00',
          nombre: 'Ana Martínez',
          apellidos: 'Martínez López',
          edad: 32,
          alergias: 'Penicilina',
          antecedentes: 'Asma',
          telefono: '666123456',
          especialidad: 'Medicina General',
          profesional: 'Dra. Ana López'
        },
        {
          hora: '10:00',
          nombre: 'Luis Gómez',
          apellidos: 'Gómez Pérez',
          edad: 45,
          alergias: 'Ninguna',
          antecedentes: 'Hipertensión',
          telefono: '666654321',
          especialidad: 'Fisioterapia',
          profesional: 'Dra. Marta Ruiz'
        }
      ]);
      const [pantalla, setPantalla] = useState('login');
      const [modoReserva, setModoReserva] = useState('paciente');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [especialidad, setEspecialidad] = useState('');
      const [profesional, setProfesional] = useState('');
      const [hora, setHora] = useState('');
      const [confirmar, setConfirmar] = useState(false);
      const [nombrePaciente, setNombrePaciente] = useState('');
      const [stepReserva, setStepReserva] = useState(0); // 0: elegir especialidad, 1: elegir profesional, 2: calendario
      const [profesionalSeleccionado, setProfesionalSeleccionado] = useState('');
      const [mostrarCitas, setMostrarCitas] = useState(false);

      const ESPECIALIDADES = [
        'Medicina General',
        'Fisioterapia',
        'Psicología'
      ];
      const PROFESIONALES = {
        'Medicina General': ['Dra. Ana López', 'Dr. Juan Pérez'],
        'Fisioterapia': ['Dra. Marta Ruiz', 'Dr. Pablo Torres'],
        'Psicología': ['Dra. Laura Gómez', 'Dr. Sergio Díaz']
      };
      const HORAS = [
        '09:00', '10:00', '11:30', '12:30', '16:00', '17:00', '18:30'
      ];

      const handleEspecialidad = (e) => {
        setEspecialidad(e.target.value);
        setProfesional('');
        setHora('');
        setConfirmar(false);
      };
      const handleProfesional = (e) => {
        setProfesional(e.target.value);
        setHora('');
        setConfirmar(false);
      };
      const handleHora = (h) => {
        setHora(h);
        setConfirmar(false);
      };
      const handleConfirmar = () => {
        setConfirmar(true);
      };
      const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@clinica.com') {
          setModoReserva('admin');
          setPantalla('reserva');
        } else if (email === 'paciente@gmail.com') {
          setModoReserva('paciente');
          setPantalla('reserva');
        } else {
          alert('Usuario no reconocido. Usa admin@clinica.com o paciente@gmail.com');
        }
      };

      if (pantalla === 'login') {
        return (
          <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '32px 24px', maxWidth: 380, width: '100%', border: '1.5px solid #18BC9C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 0.5 }}>Acceso Portal SaludCitas</h1>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" style={{ width: '100%', marginBottom: 16, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={{ width: '100%', marginBottom: 24, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
              <button type="submit" style={{ width: '100%', padding: '14px 0', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(24,188,156,0.08)' }}>Entrar</button>
              <div style={{ marginTop: 18, color: '#888', fontSize: 14, textAlign: 'center' }}>
                <div>Admin: admin@clinica.com</div>
                <div>Paciente: paciente@gmail.com</div>
              </div>
            </form>
          </div>
        );
      }

      if (pantalla === 'reserva') {
        // Definir profesionales por especialidad
        const PROFESIONALES_UI = {
          'Medicina Deportiva': [
            { nombre: 'Dr. Aparicio', icon: '🏃‍♂️', color: '#22c55e' },
            { nombre: 'Dra. Benitez', icon: '🏃‍♀️', color: '#22c55e' }
          ],
          'Fisioterapia': [
            { nombre: 'Maria', icon: '🦴', color: '#14532d' },
            { nombre: 'Angel', icon: '🦴', color: '#14532d' }
          ],
          'Odontología': [
            { nombre: 'Dra. Laura Gómez', icon: '🦷', color: '#14532d' }
          ],
          'Psicología': [
            { nombre: 'Dr. Sergio Diaz', icon: '🧠', color: '#14532d' }
          ]
        };
        return (
          <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}>
            {/* Botón Mis Citas */}
            <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button
                onClick={() => setMostrarCitas((v) => !v)}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: 16, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                Mis Citas
              </button>
            </div>
            {/* Panel principal */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(44,62,80,0.08)',
              padding: '32px 24px',
              maxWidth: 600,
              width: '100%',
              margin: '0 auto',
              border: '1.5px solid #18BC9C',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 400,
              position: 'relative'
            }}>
                            {/* Botón Volver */}
                            {modoReserva === 'paciente' && stepReserva > 0 && !mostrarCitas && (
                              <button
                                style={{
                                  position: 'absolute',
                                  left: 32,
                                  bottom: 24,
                                  background: '#e5e7eb',
                                  color: '#14532d',
                                  fontWeight: 700,
                                  fontSize: 16,
                                  borderRadius: 8,
                                  padding: '10px 28px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 8px #18bc9c11',
                                  transition: 'background 0.18s',
                                }}
                                onClick={() => {
                                  if (stepReserva === 2) setStepReserva(1);
                                  else if (stepReserva === 1) setStepReserva(0);
                                }}
                              >
                                Volver
                              </button>
                            )}
              <h1 style={{ color: '#14532d', fontWeight: 700, fontSize: 28, marginBottom: 10, letterSpacing: 0.5, textAlign: 'center' }}>
                Reserva tu Cita Online - <span style={{ color: '#18BC9C' }}>Clínica SaludCitas</span>
              </h1>
              {/* Lista de citas */}
              {mostrarCitas && (
                <div style={{ width: '100%', margin: '24px 0 0 0', background: '#f4f6fa', borderRadius: 12, padding: '24px 18px', boxShadow: '0 2px 8px #18bc9c11', color: '#14532d' }}>
                  <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Mis Citas</h2>
                  {agenda.length === 0 && <div style={{ color: '#888', fontSize: 16 }}>No tienes citas reservadas.</div>}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {agenda.map((cita, idx) => (
                      <li key={idx} style={{ marginBottom: 10, fontSize: 17, fontWeight: 500, background: '#fff', borderRadius: 8, padding: '10px 14px', boxShadow: '0 1px 4px #18bc9c11', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {cita.fecha ? `${cita.fecha} - ` : ''}{cita.hora} - {cita.especialidad || cita.profesional || ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {modoReserva === 'paciente' && stepReserva === 0 && (
                <>
                  <div style={{ fontSize: 18, color: '#14532d', margin: '12px 0 24px 0', textAlign: 'center' }}>
                    Paso 1: ¿Qué tipo de cita necesitas hoy?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 480, margin: '0 auto' }}>
                    <button onClick={() => { setEspecialidad('Medicina Deportiva'); setStepReserva(1); }} style={{ background: '#fff', border: 'none', borderRadius: 16, boxShadow: '0 2px 12px #18bc9c22', padding: '32px 0', fontWeight: 600, fontSize: 20, color: '#14532d', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.18s', outline: 'none' }}>
                      <span style={{ fontSize: 38, marginBottom: 8 }}>🏃‍♂️</span>
                      Medicina Deportiva
                    </button>
                    <button onClick={() => { setEspecialidad('Fisioterapia'); setStepReserva(1); }} style={{ background: '#fff', border: 'none', borderRadius: 16, boxShadow: '0 2px 12px #18bc9c22', padding: '32px 0', fontWeight: 600, fontSize: 20, color: '#14532d', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.18s', outline: 'none' }}>
                      <span style={{ fontSize: 38, marginBottom: 8 }}>🦴</span>
                      Fisioterapia
                    </button>
                    <button onClick={() => { setEspecialidad('Odontología'); setStepReserva(1); }} style={{ background: '#fff', border: 'none', borderRadius: 16, boxShadow: '0 2px 12px #18bc9c22', padding: '32px 0', fontWeight: 600, fontSize: 20, color: '#14532d', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.18s', outline: 'none' }}>
                      <span style={{ fontSize: 38, marginBottom: 8 }}>🦷</span>
                      Odontología
                    </button>
                    <button onClick={() => { setEspecialidad('Psicología'); setStepReserva(1); }} style={{ background: '#fff', border: 'none', borderRadius: 16, boxShadow: '0 2px 12px #18bc9c22', padding: '32px 0', fontWeight: 600, fontSize: 20, color: '#14532d', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.18s', outline: 'none' }}>
                      <span style={{ fontSize: 38, marginBottom: 8 }}>🧠</span>
                      Psicología
                    </button>
                  </div>
                  <div style={{ marginTop: 32, color: '#888', fontSize: 15, textAlign: 'center' }}>
                    Avenida Ricardo Soriano, Marbella | 912 345 678
                  </div>
                </>
              )}
              {modoReserva === 'paciente' && stepReserva === 1 && especialidad && (
                <>
                  <div style={{ fontSize: 18, color: '#14532d', margin: '12px 0 24px 0', textAlign: 'center' }}>
                    Paso 2: ¿Con qué especialista quieres la cita?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 480, margin: '0 auto' }}>
                    {PROFESIONALES_UI[especialidad]?.map((pro) => (
                      <button
                        key={pro.nombre}
                        onClick={() => setProfesionalSeleccionado(pro.nombre)}
                        style={{
                          background: profesionalSeleccionado === pro.nombre ? '#22c55e' : '#fff',
                          border: 'none',
                          borderRadius: 16,
                          boxShadow: '0 2px 12px #18bc9c22',
                          padding: '32px 0',
                          fontWeight: 600,
                          fontSize: 20,
                          color: profesionalSeleccionado === pro.nombre ? '#fff' : '#14532d',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.18s',
                          outline: 'none',
                          position: 'relative'
                        }}
                      >
                        <span style={{ fontSize: 28, marginBottom: 8, background: profesionalSeleccionado === pro.nombre ? '#fff' : '#e5f9ed', color: profesionalSeleccionado === pro.nombre ? '#22c55e' : '#14532d', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{pro.icon}</span>
                        {pro.nombre}
                        {profesionalSeleccionado === pro.nombre && (
                          <span style={{ position: 'absolute', top: 16, right: 16, background: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontWeight: 700, fontSize: 20, border: '2px solid #22c55e' }}>✔</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    style={{
                      marginTop: 32,
                      background: profesionalSeleccionado ? '#2563eb' : '#bcd1f7',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 20,
                      borderRadius: 10,
                      padding: '14px 38px',
                      boxShadow: '0 2px 8px #2563eb22',
                      border: 'none',
                      cursor: profesionalSeleccionado ? 'pointer' : 'not-allowed',
                      transition: 'background 0.18s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    disabled={!profesionalSeleccionado}
                    onClick={() => setStepReserva(2)}
                  >
                    Continuar <span style={{ fontSize: 24, marginLeft: 8 }}>➤</span>
                  </button>
                </>
              )}
              {modoReserva === 'paciente' && stepReserva === 2 && (
                <CalendarReserva
                  onReservaConfirmada={({ fecha, hora, nombre, telefono }) => {
                    setConfirmar(true);
                    setAgenda(prev => [...prev, {
                      hora,
                      nombre,
                      telefono,
                      fecha,
                      especialidad,
                      profesional: profesionalSeleccionado
                    }]);
                  }}
                  onVolverInicio={() => {
                    setStepReserva(0);
                    setProfesionalSeleccionado('');
                  }}
                  onCancelarCita={handleCancelarCita}
                />
              )}
                    {citaCancelada && (
                      <div style={{
                        position: 'fixed',
                        bottom: 32,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        color: '#e11d48',
                        fontWeight: 700,
                        fontSize: 17,
                        borderRadius: 8,
                        padding: '12px 32px',
                        boxShadow: '0 2px 8px #e11d4811',
                        border: '2px solid #e11d48',
                        zIndex: 99999
                      }}>
                        Cita cancelada correctamente
                      </div>
                    )}
              {/* Solo calendario para paciente, sin inputs de historiaActual */}
            </div>
          </div>
        );
      }

      return null;
// Fin de la función App
    // ...existing code...

  // Pantalla de Login
  if (pantalla === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '32px 24px', maxWidth: 380, width: '100%', border: '1.5px solid #18BC9C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 0.5 }}>Acceso Portal SaludCitas</h1>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" style={{ width: '100%', marginBottom: 16, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={{ width: '100%', marginBottom: 24, padding: '12px', borderRadius: 6, border: '1.5px solid #18BC9C', fontSize: 15 }} required />
          <button type="submit" style={{ width: '100%', padding: '14px 0', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(24,188,156,0.08)' }}>Entrar</button>
          <div style={{ marginTop: 18, color: '#888', fontSize: 14, textAlign: 'center' }}>
            <div>Admin: admin@clinica.com</div>
            <div>Paciente: paciente@gmail.com</div>
          </div>
        </form>
      </div>
    );
  }

  // Pantalla de Reserva Online (unificada para paciente y admin)
  if (pantalla === 'reserva') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(44,62,80,0.08)',
          padding: '32px 24px',
          maxWidth: 420,
          width: '100%',
          margin: '0 auto',
          border: '1.5px solid #18BC9C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 26, marginBottom: 18, letterSpacing: 0.5 }}>
            {modoReserva === 'admin' ? (
              <>Panel de Gestión de Citas - <span style={{ color: '#18BC9C' }}>Administración</span></>
            ) : (
              <>Reserva tu Cita Online - <span style={{ color: '#18BC9C' }}>Clínica SaludCitas</span></>
            )}
          </h1>
          {/* Reserva para paciente: solo calendario */}
          {modoReserva === 'paciente' && (
            <CalendarReserva
              onReservaConfirmada={({ fecha, hora, nombre, telefono }) => {
                setConfirmar(true);
                setAgenda(prev => [...prev, {
                  hora,
                  nombre,
                  telefono,
                  fecha
                }]);
              }}
            />
          )}
          {/* Agenda admin: lista de citas */}
          {modoReserva === 'admin' && (
            <div style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', background: '#f4f6fa', minHeight: '100vh', padding: '48px 0 48px 0' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 48, padding: '0 32px' }}>
                {/* Columna izquierda: Formulario */}
                <div style={{ flex: 1, minWidth: 340 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(44,62,80,0.09)', padding: '40px 36px', marginBottom: 32 }}>
                    <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Crear nueva cita</h2>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div>
                        <label htmlFor="admin-nombre" style={{ fontWeight: 600, fontSize: 15, color: '#34495e', marginBottom: 6, display: 'block' }}>Nombre del paciente</label>
                        <input type="text" id="admin-nombre" placeholder="Nombre del paciente" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #18BC9C', fontSize: 16, marginTop: 4 }} />
                      </div>
                      <div>
                        <label htmlFor="admin-especialidad" style={{ fontWeight: 600, fontSize: 15, color: '#34495e', marginBottom: 6, display: 'block' }}>Especialidad</label>
                        <select id="admin-especialidad" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #18BC9C', fontSize: 16, marginTop: 4 }}>
                          <option value="">Selecciona especialidad</option>
                          {ESPECIALIDADES.map((esp) => (
                            <option key={esp} value={esp}>{esp}</option>
                          ))}
                        </select>
                      </div>
                      <button style={{ padding: '12px 0', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 8, boxShadow: '0 2px 8px rgba(24,188,156,0.08)' }}>Añadir cita</button>
                    </form>
                  </div>
                </div>
                {/* Columna derecha: Agenda visual estilo Fresha */}
                <div style={{ flex: 2 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(44,62,80,0.09)', padding: '40px 36px' }}>
                    <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Agenda de hoy</h2>
                    {/* Multi-columna por profesional */}
                    <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${Object.values(PROFESIONALES).flat().length}, 1fr)`, gap: 32, alignItems: 'start' }}>
                      {/* Columna de horas */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 18 }}>
                        <div style={{ height: 40 }}></div>
                        {HORAS.map(h => (
                          <div key={h} style={{ color: '#b2bec3', fontWeight: 600, fontSize: 15, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{h}</div>
                        ))}
                      </div>
                      {/* Columnas de profesionales */}
                      {Object.values(PROFESIONALES).flat().map((prof, idx) => (
                        <div key={prof} style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                          {/* Avatar y nombre del profesional arriba */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e0f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>
                              <span style={{ fontSize: 28, color: '#18BC9C', fontWeight: 700 }}>{prof.split(' ')[1]?.[0] || 'D'}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16, color: '#34495e', textAlign: 'center', maxWidth: 90, lineHeight: 1.2 }}>{prof}</div>
                          </div>
                          {HORAS.map(h => {
                            const cita = agenda.find(c => c.hora === h && c.profesional === prof);
                            if (!cita) {
                              return <div key={h} style={{ height: 60 }}></div>;
                            }
                            // Colores pasteles y borde lateral
                            const colorMap = {
                              'Medicina General': { bg: '#e3f6fd', border: '#38b6ff' },
                              'Fisioterapia': { bg: '#fff4e3', border: '#ffb347' },
                              'Psicología': { bg: '#e3ffe3', border: '#43d96b' }
                            };
                            const color = colorMap[cita.especialidad] || { bg: '#f4f6fa', border: '#b2bec3' };
                            return (
                              <div
                                key={h}
                                onClick={() => { setShowHistoria(true); setHistoriaActual(cita); }}
                                style={{
                                  height: 60,
                                  background: color.bg,
                                  borderRadius: 10,
                                  borderLeft: `6px solid ${color.border}`,
                                  boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  padding: '0 18px',
                                  cursor: 'pointer',
                                  marginBottom: 0
                                }}
                              >
                                <div style={{ fontWeight: 700, color: '#2C3E50', fontSize: 17 }}>{cita.nombre}</div>
                                <div style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>{cita.especialidad}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                    <button type="button" onClick={() => setPantalla('login')} className="btn-login" style={{ padding: '10px 24px', background: '#34495e', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cerrar sesión</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal historia clínica admin */}
          {showHistoria && historiaActual && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.18)', padding: '32px 24px', maxWidth: 420, width: '100%', border: '1.5px solid #18BC9C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: '#2C3E50', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Historia Clínica</h2>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Nombre:</strong> <input value={historiaActual.nombre} onChange={e => setHistoriaActual({...historiaActual, nombre: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Apellidos:</strong> <input value={historiaActual.apellidos} onChange={e => setHistoriaActual({...historiaActual, apellidos: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Edad:</strong> <input value={historiaActual.edad} onChange={e => setHistoriaActual({...historiaActual, edad: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Teléfono:</strong> <input value={historiaActual.telefono} onChange={e => setHistoriaActual({...historiaActual, telefono: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Alergias:</strong> <input value={historiaActual.alergias} onChange={e => setHistoriaActual({...historiaActual, alergias: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Antecedentes:</strong> <input value={historiaActual.antecedentes} onChange={e => setHistoriaActual({...historiaActual, antecedentes: e.target.value})} style={{ width: '100%', border: 'none', background: '#f8f9fa', fontSize: 16, color: '#2C3E50', borderRadius: 6, padding: '4px 8px' }} /></div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Especialidad:</strong> {historiaActual.especialidad}</div>
                <div style={{ marginBottom: 12, fontSize: 16 }}><strong>Hora:</strong> {historiaActual.hora}</div>
                <button onClick={() => setShowHistoria(false)} style={{ marginTop: 18, padding: '10px 24px', background: '#18BC9C', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Guardar cambios</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}