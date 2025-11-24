import React from 'react';
import '../styles/Mantenimiento.css';

const Mantenimiento = () => {
  return (
    <div className="mantenimiento-container">
      <div className="mantenimiento-content">
        <h1>🔧 Temporalmente Fuera de Servicio</h1>
        <p>Estamos realizando mejoras en Rosaline</p>
        <p>Volveremos pronto. Gracias por tu paciencia.</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Mantenimiento;
