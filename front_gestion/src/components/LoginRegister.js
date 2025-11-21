import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';
import "../styles/LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ correo: "", contraseña: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendingPin, setResendingPin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register, loading } = useAuth();

  // Si ya hay sesión, redirige a home o a la página desde donde vino
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar mensajes al cambiar campos
    setError("");
    setSuccessMessage("");
    setShowResendButton(false);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setShowResendButton(false);
    const result = await login(form.correo, form.contraseña);
    if (!result.success) {
      // Verificar si el error es por cuenta no confirmada (403)
      if (result.error && (result.error.includes('403') || result.error.toLowerCase().includes('confirmada') || result.error.toLowerCase().includes('confirmar'))) {
        setError("Debes confirmar tu cuenta antes de iniciar sesión. Revisa tu correo para obtener el PIN de confirmación o solicita uno nuevo.");
        setShowResendButton(true);
      } else if (result.error && (result.error.includes('404') || result.error.toLowerCase().includes('no encontrado') || result.error.toLowerCase().includes('not found'))) {
        setError("Usuario no registrado. Por favor verifica tu correo o regístrate.");
      } else {
        setError(result.error || "Credenciales incorrectas.");
      }
    }
  };

  const handleResendPin = async () => {
    if (!form.correo) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }
    
    setResendingPin(true);
    setError("");
    setSuccessMessage("");
    
    try {
      await apiClient.post(API_ENDPOINTS.REENVIAR_CONFIRMACION, {
        correo: form.correo
      });
      setSuccessMessage("PIN de confirmación reenviado. Revisa tu bandeja de entrada.");
      setShowResendButton(false);
      // Redirigir a la página de confirmación después de 2 segundos
      setTimeout(() => {
        navigate('/confirmar-cuenta', { state: { correo: form.correo } });
      }, 2000);
    } catch (error) {
      console.error('Error al reenviar PIN:', error);
      setError(error.message || 'Error al reenviar el PIN de confirmación');
    } finally {
      setResendingPin(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const correoRegistrado = form.correo;
    const result = await register(form.correo, form.contraseña);
    if (result.success) {
      // Redirigir directamente a la página de confirmación con el correo
      navigate('/confirmar-cuenta', { 
        state: { 
          correo: correoRegistrado,
          fromRegister: true 
        } 
      });
    } else {
      setError(result.error || "Error al registrarse.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
            required
            minLength={8}
          />
          {error && <div className="login-error">{error}</div>}
          {successMessage && <div className="login-success">{successMessage}</div>}
          {showResendButton && (
            <button 
              type="button" 
              onClick={handleResendPin}
              disabled={resendingPin}
              style={{
                marginTop: '1rem',
                background: 'linear-gradient(45deg, #d4a574, #8B5FBF)',
                color: 'white',
                border: 'none',
                padding: '0.7rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: resendingPin ? 'not-allowed' : 'pointer',
                opacity: resendingPin ? 0.7 : 1
              }}
            >
              {resendingPin ? 'Enviando...' : 'Reenviar PIN de confirmación'}
            </button>
          )}
          {!isLogin && (
            <div className="login-info">
              <p>Al registrarte, recibirás un email de confirmación. Debes confirmar tu cuenta antes de iniciar sesión.</p>
              <p>Puedes completar tu perfil (nombre, apellido, teléfono, dirección) después de confirmar tu cuenta en "Mi Cuenta".</p>
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
          {loading && <div className="login-loading">Procesando...</div>}
        </form>
        <div className="login-toggle">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <span onClick={() => { setIsLogin(false); setError(""); setSuccessMessage(""); }}>Regístrate</span>
              {" | "}
              <span onClick={() => navigate("/recuperar-contraseña")} style={{ cursor: "pointer", color: "#d4a574" }}>
                ¿Olvidaste tu contraseña?
              </span>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => { setIsLogin(true); setError(""); setSuccessMessage(""); }}>Inicia sesión</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
