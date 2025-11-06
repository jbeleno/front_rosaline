import React from 'react';
import './LoadingSpinner.css';

export function LoadingSpinner({ size = 'medium', message = 'Cargando...' }) {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;

