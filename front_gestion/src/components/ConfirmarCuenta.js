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
    // Necesitamos el correo del usuario, pero no lo tenemos aquí
    // Podríamos pedirlo o redirigir a una página donde lo soliciten
    navigate("/login");
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
            <div className="error-actions">
              <button onClick={() => navigate("/login")} className="button button-primary">
                Ir al login
              </button>
              <p className="help-text">
                Si no recibiste el email de confirmación, puedes solicitar uno nuevo desde la página de login.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmarCuenta;

