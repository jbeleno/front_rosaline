import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../shared/services/api/apiClient";
import { API_ENDPOINTS } from "../shared/services/api/endpoints";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/CambiarContraseña.css";
import { FaKey, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function CambiarContraseña() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    contraseña_actual: "",
    nueva_contraseña: "",
    confirmar_contraseña: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
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

    if (form.contraseña_actual === form.nueva_contraseña) {
      setError("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.CAMBIAR_CONTRASEÑA_AUTENTICADO, {
        contraseña_actual: form.contraseña_actual,
        nueva_contraseña: form.nueva_contraseña,
      });

      setSuccess(response.mensaje || "Contraseña cambiada exitosamente.");
      // Limpiar formulario
      setForm({
        contraseña_actual: "",
        nueva_contraseña: "",
        confirmar_contraseña: "",
      });
      // Redirigir a mi cuenta después de 2 segundos
      setTimeout(() => {
        navigate("/micuenta");
      }, 2000);
    } catch (error) {
      setError(error.message || "Error al cambiar la contraseña. Verifica que tu contraseña actual sea correcta.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <div className="cambiar-contraseña-container">
      <div className="cambiar-contraseña-card">
        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-icon">
            <FaKey />
          </div>
          <p>Para cambiar tu contraseña, ingresa tu contraseña actual y la nueva contraseña.</p>
          <input
            type="password"
            name="contraseña_actual"
            placeholder="Contraseña actual"
            value={form.contraseña_actual}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="nueva_contraseña"
            placeholder="Nueva contraseña (mínimo 8 caracteres)"
            value={form.nueva_contraseña}
            onChange={handleChange}
            minLength={8}
            required
          />
          <input
            type="password"
            name="confirmar_contraseña"
            placeholder="Confirmar nueva contraseña"
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
            onClick={() => navigate("/micuenta")}
            className="button button-outline"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CambiarContraseña;

