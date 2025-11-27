import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const validateForm = () => {
    if (!form.correo) {
      toast.error("El correo es obligatorio");
      return false;
    }
    if (!form.contraseña) {
      toast.error("La contraseña es obligatoria");
      return false;
    }
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      toast.error("Por favor ingresa un correo válido");
      return false;
    }
    // Validación de longitud de contraseña en registro
    if (!isLogin && form.contraseña.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    return true;
  };

  const handleLogin = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setSuccessMessage("");
    setShowResendButton(false);
    const result = await login(form.correo, form.contraseña);
    if (!result.success) {
      // Verificar si el error es por cuenta no confirmada (403)
      if (result.error && (result.error.includes('403') || result.error.toLowerCase().includes('confirmada') || result.error.toLowerCase().includes('confirmar'))) {
        const msg = "Debes confirmar tu cuenta antes de iniciar sesión.";
        setError(msg);
        toast.error(msg);
        setShowResendButton(true);
      } else if (result.error && (result.error.includes('404') || result.error.toLowerCase().includes('no encontrado') || result.error.toLowerCase().includes('not found'))) {
        const msg = "Usuario no registrado. Por favor verifica tu correo o regístrate.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = result.error || "Credenciales incorrectas.";
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleResendPin = async () => {
    if (!form.correo) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    setResendingPin(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiClient.post(API_ENDPOINTS.REENVIAR_CONFIRMACION, {
        correo: form.correo
      });
      const msg = "PIN de confirmación reenviado. Revisa tu bandeja de entrada.";
      setSuccessMessage(msg);
      toast.success(msg);
      setShowResendButton(false);
      // Redirigir a la página de confirmación después de 2 segundos
      setTimeout(() => {
        navigate('/confirmar-cuenta', { state: { correo: form.correo } });
      }, 2000);
    } catch (error) {
      console.error('Error al reenviar PIN:', error);
      const msg = error.message || 'Error al reenviar el PIN de confirmación';
      setError(msg);
      toast.error(msg);
    } finally {
      setResendingPin(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setSuccessMessage("");
    const correoRegistrado = form.correo;
    const result = await register(form.correo, form.contraseña);
    if (result.success) {
      toast.success("Registro exitoso. Redirigiendo...");
      // Redirigir directamente a la página de confirmación con el correo
      navigate('/confirmar-cuenta', {
        state: {
          correo: correoRegistrado,
          fromRegister: true
        }
      });
    } else {
      const msg = result.error || "Error al registrarse.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-card">
        <h2>{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister} noValidate>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
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
