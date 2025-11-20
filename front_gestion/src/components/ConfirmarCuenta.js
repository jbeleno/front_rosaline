import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../shared/services/api/apiClient";
import { API_ENDPOINTS } from "../shared/services/api/endpoints";
import "../styles/ConfirmarCuenta.css";
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaSpinner } from "react-icons/fa";

function ConfirmarCuenta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const [correo, setCorreo] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      confirmarCuenta(tokenParam);
    } else {
      setStatus("error");
      setMessage("No se proporcionó un token de confirmación válido.");
    }
  }, [searchParams]);

  const confirmarCuenta = async (tokenValue) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONFIRMAR_CUENTA, {
        token: tokenValue,
      });
      setStatus("success");
      setMessage(response.mensaje || "Cuenta confirmada exitosamente. Ya puedes iniciar sesión.");
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Error al confirmar la cuenta. El token puede haber expirado o ser inválido.");
    }
  };

  const reenviarConfirmacion = async () => {
    if (!correo || !correo.includes("@")) {
      setMessage("Por favor ingresa un correo válido.");
      return;
    }
    
    setEnviando(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.REENVIAR_CONFIRMACION, {
        correo: correo
      });
      // Redirigir al login después de reenviar exitosamente
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Error al reenviar la confirmación. Verifica que el correo sea correcto.");
      setEnviando(false);
    }
  };

  return (
    <div className="confirmar-cuenta-container">
      <div className="confirmar-cuenta-card">
        {status === "loading" && (
          <>
            <FaSpinner className="spinner-icon" />
            <h2>Confirmando tu cuenta...</h2>
            <p>Por favor espera mientras verificamos tu token de confirmación.</p>
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
            
            {!mostrarReenvio ? (
              <div className="error-actions">
                <button onClick={() => navigate("/login")} className="button button-primary">
                  Ir al login
                </button>
                <button 
                  onClick={() => setMostrarReenvio(true)} 
                  className="button button-secondary"
                  style={{ marginLeft: "10px" }}
                >
                  Reenviar confirmación
                </button>
                <p className="help-text">
                  Si el token expiró o es inválido, puedes solicitar un nuevo email de confirmación.
                </p>
              </div>
            ) : (
              <div className="reenvio-form">
                <p className="help-text">
                  {enviando && status !== "success" 
                    ? "Email de confirmación reenviado. Revisa tu bandeja de entrada." 
                    : "Ingresa tu correo electrónico para recibir un nuevo link de confirmación:"}
                </p>
                {!enviando && (
                  <>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="input-correo"
                    />
                    <div className="button-group">
                      <button 
                        onClick={reenviarConfirmacion} 
                        className="button button-primary"
                      >
                        Enviar
                      </button>
                      <button 
                        onClick={() => setMostrarReenvio(false)} 
                        className="button button-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
                {enviando && (
                  <div style={{ marginTop: "1rem" }}>
                    <FaSpinner className="spinner-icon" style={{ fontSize: "2rem" }} />
                    <p>Redirigiendo al login...</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmarCuenta;

