import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../shared/services/api/apiClient";
import { API_ENDPOINTS } from "../shared/services/api/endpoints";
import "../styles/RecuperarContraseña.css";
import { FaEnvelope, FaKey, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function RecuperarContraseña() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: solicitar, 2: validar PIN, 3: cambiar contraseña
  const [form, setForm] = useState({
    correo: "",
    pin: "",
    nueva_contraseña: "",
    confirmar_contraseña: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSolicitarRecuperacion = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.SOLICITAR_RECUPERACION, {
        correo: form.correo,
      });
      setSuccess(response.mensaje || "Se ha enviado un PIN de recuperación a tu correo.");
      setStep(2);
    } catch (error) {
      setError(error.message || "Error al solicitar recuperación de contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidarPin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.pin || form.pin.length !== 6) {
      setError("El PIN debe tener 6 dígitos.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.VALIDAR_PIN, {
        correo: form.correo,
        pin: form.pin,
      });

      if (response.valido) {
        setSuccess(response.mensaje || "PIN válido. Ahora puedes cambiar tu contraseña.");
        setStep(3);
      } else {
        setError(response.mensaje || "PIN inválido o expirado.");
      }
    } catch (error) {
      setError(error.message || "Error al validar el PIN.");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.nueva_contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.nueva_contraseña !== form.confirmar_contraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.CAMBIAR_CONTRASEÑA, {
        correo: form.correo,
        pin: form.pin,
        nueva_contraseña: form.nueva_contraseña,
      });

      setSuccess(response.mensaje || "Contraseña cambiada exitosamente.");
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-contraseña-container">
      <div className="recuperar-contraseña-card">
        <h2>Recuperar Contraseña</h2>

        {step === 1 && (
          <form onSubmit={handleSolicitarRecuperacion}>
            <div className="form-icon">
              <FaEnvelope />
            </div>
            <p>Ingresa tu correo electrónico y te enviaremos un PIN de 6 dígitos para recuperar tu contraseña.</p>
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" disabled={loading} className="button button-primary">
              {loading ? "Enviando..." : "Enviar PIN"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="button button-outline"
            >
              Volver al login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleValidarPin}>
            <div className="form-icon">
              <FaKey />
            </div>
            <p>Ingresa el PIN de 6 dígitos que recibiste en tu correo electrónico.</p>
            <input
              type="text"
              name="pin"
              placeholder="PIN de 6 dígitos"
              value={form.pin}
              onChange={handleChange}
              maxLength={6}
              pattern="[0-9]{6}"
              required
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" disabled={loading} className="button button-primary">
              {loading ? "Validando..." : "Validar PIN"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setForm({ ...form, pin: "" });
                setError("");
                setSuccess("");
              }}
              className="button button-outline"
            >
              Volver
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCambiarContraseña}>
            <div className="form-icon">
              <FaCheckCircle />
            </div>
            <p>Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.</p>
            <input
              type="password"
              name="nueva_contraseña"
              placeholder="Nueva contraseña"
              value={form.nueva_contraseña}
              onChange={handleChange}
              minLength={8}
              required
            />
            <input
              type="password"
              name="confirmar_contraseña"
              placeholder="Confirmar contraseña"
              value={form.confirmar_contraseña}
              onChange={handleChange}
              minLength={8}
              required
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" disabled={loading} className="button button-primary">
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setForm({ ...form, nueva_contraseña: "", confirmar_contraseña: "" });
                setError("");
                setSuccess("");
              }}
              className="button button-outline"
            >
              Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecuperarContraseña;

