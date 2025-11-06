import React from 'react';
import '../styles/ErrorMessage.css';

export function ErrorMessage({ message = 'Ha ocurrido un error', error, onRetry }) {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{message}</h3>
      {error && (
        <p className="error-details">{error.message || error}</p>
      )}
      {onRetry && (
        <button className="error-retry-button" onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

