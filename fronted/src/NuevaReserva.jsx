import React from 'react';

export default function NuevaReserva() {
  return (
    <div className="container-login">
      <div className="card-login" style={{ maxWidth: '500px' }}>
        
        {/* Título */}
        <h1 className="title">Nueva Reserva</h1>

        {/* Formulario */}
        <form style={{ marginTop: '32px' }}>
          {/* Seleccionar Médico */}
          <div className="form-group">
            <label className="form-label">Médico</label>
            <select className="form-input" style={{ cursor: 'pointer' }}>
              <option value="">Selecciona un médico</option>
              <option value="1">Dr. Carlos Rodríguez</option>
              <option value="2">Dra. María González</option>
              <option value="3">Dr. Juan Martínez</option>
            </select>
          </div>

          {/* Seleccionar Fecha */}
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input 
              type="date"
              className="form-input"
            />
          </div>

          {/* Botón Reservar */}
          <button type="button" className="btn-login">
            Reservar Cita
          </button>
        </form>

      </div>
    </div>
  );
}
