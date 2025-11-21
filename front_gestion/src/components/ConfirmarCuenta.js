import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../shared/services/api/apiClient";
import { API_ENDPOINTS } from "../shared/services/api/endpoints";
import "../styles/ConfirmarCuenta.css";
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaSpinner } from "react-icons/fa";

function ConfirmarCuenta() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("input"); // input, loading, success, error
  const [message, setMessage] = useState("");
  const [correo, setCorreo] = useState(location.state?.correo || "");
  const [pin, setPin] = useState("");
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const fromRegister = location.state?.fromRegister || false;

  const confirmarCuenta = async (e) => {
    e.preventDefault();
    
    if (!correo || !pin) {
      setMessage("Por favor ingresa tu correo y el PIN de 6 dígitos.");
      return;
    }

    if (pin.length !== 6) {
      setMessage("El PIN debe tener 6 dígitos.");
      return;
    }

    setStatus("loading");
    setMessage("");
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONFIRMAR_CUENTA, {
        correo: correo,
        pin: pin
      });
      setStatus("success");
      setMessage(response.mensaje || "Cuenta confirmada exitosamente. Ya puedes iniciar sesión.");
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Error al confirmar la cuenta. El PIN puede haber expirado o ser inválido.");
    }
  };

  const reenviarConfirmacion = async () => {
    if (!correo || !correo.includes("@")) {
      setMessage("Por favor ingresa un correo válido.");
      return;
    }
    
    setEnviando(true);
    setMessage("");
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.REENVIAR_CONFIRMACION, {
        correo: correo
      });
      setMessage("PIN de confirmación reenviado. Revisa tu bandeja de entrada.");
      setMostrarReenvio(false);
      setEnviando(false);
      setStatus("input");
      setPin("");
    } catch (error) {
      setMessage(error.message || "Error al reenviar la confirmación. Verifica que el correo sea correcto.");
      setEnviando(false);
    }
  };

  return (
    <div className="confirmar-cuenta-container">
      <div className="confirmar-cuenta-card">
        {status === "input" && (
          <>
            <FaEnvelope className="email-icon" style={{ fontSize: "3rem", color: "#8B5FBF", marginBottom: "1rem" }} />
            <h2>Confirmar tu cuenta</h2>
            {fromRegister && (
              <div style={{ 
                background: "#e8f5e9", 
                padding: "1rem", 
                borderRadius: "8px", 
                marginBottom: "1rem",
                border: "1px solid #4caf50"
              }}>
                <p style={{ color: "#2e7d32", fontWeight: "600", margin: 0 }}>
                  ✅ ¡Registro exitoso! Revisa tu correo para obtener el PIN de confirmación.
                </p>
              </div>
            )}
            <p style={{ marginBottom: "1.5rem", color: "#666" }}>
              Ingresa el PIN de 6 dígitos que recibiste en tu correo electrónico
            </p>
            
            <form onSubmit={confirmarCuenta} style={{ width: "100%" }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="input-correo"
                required
                style={{ marginBottom: "1rem" }}
              />
              <input
                type="text"
                placeholder="PIN de 6 dígitos"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPin(value);
                }}
                className="input-correo"
                required
                maxLength={6}
                style={{ 
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  letterSpacing: "0.5rem"
                }}
              />
              
              {message && (
                <p style={{ 
                  color: message.includes("Error") || message.includes("inválido") ? "#d32f2f" : "#4caf50",
                  marginBottom: "1rem"
                }}>
                  {message}
                </p>
              )}
              
              <button type="submit" className="button button-primary" style={{ width: "100%", marginBottom: "1rem" }}>
                Confirmar cuenta
              </button>
            </form>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>¿No recibiste el PIN?</p>
              <button 
                onClick={() => setMostrarReenvio(true)} 
                className="button button-secondary"
                style={{ marginTop: "0.5rem" }}
              >
                Reenviar PIN
              </button>
            </div>

            {mostrarReenvio && (
              <div className="reenvio-form" style={{ marginTop: "1.5rem", padding: "1rem", background: "#f3e5f5", borderRadius: "8px" }}>
                <p className="help-text" style={{ marginBottom: "1rem" }}>
                  Ingresa tu correo para recibir un nuevo PIN de confirmación:
                </p>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="input-correo"
                  disabled={enviando}
                  style={{ marginBottom: "1rem" }}
                />
                <div className="button-group">
                  <button 
                    onClick={reenviarConfirmacion} 
                    className="button button-primary"
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Enviar"}
                  </button>
                  <button 
                    onClick={() => setMostrarReenvio(false)} 
                    className="button button-secondary"
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {status === "loading" && (
          <>
            <FaSpinner className="spinner-icon" />
            <h2>Confirmando tu cuenta...</h2>
            <p>Por favor espera mientras verificamos tu PIN de confirmación.</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="success-icon" />
            <h2>¡Cuenta confirmada!</h2>
            <p>{message}</p>
            <p className="redirect-message">Serás redirigido al login en unos segundos...</p>
            <button onClick={() => navigate("/login")} className="button button-primary">
              Ir al login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="error-icon" />
            <h2>Error al confirmar cuenta</h2>
            <p>{message}</p>
            
            <div className="error-actions" style={{ marginTop: "1.5rem" }}>
              <button onClick={() => setStatus("input")} className="button button-primary">
                Intentar de nuevo
              </button>
              <button onClick={() => navigate("/login")} className="button button-secondary" style={{ marginLeft: "10px" }}>
                Ir al login
              </button>
              <p className="help-text" style={{ marginTop: "1rem" }}>
                Si el PIN expiró o es inválido, puedes solicitar uno nuevo usando el botón "Reenviar PIN".
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmarCuenta;

