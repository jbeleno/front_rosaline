import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ correo: "", contraseña: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const result = await login(form.correo, form.contraseña);
    if (!result.success) {
      setError(result.error || "Correo o contraseña incorrectos.");
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const result = await register(form.correo, form.contraseña);
    if (result.success) {
      setSuccessMessage("¡Registro exitoso! Se ha enviado un email de confirmación a tu correo. Por favor, revisa tu bandeja de entrada y confirma tu cuenta antes de iniciar sesión.");
      // Limpiar formulario
      setForm({ correo: "", contraseña: "" });
      // Cambiar a login después de 5 segundos
      setTimeout(() => {
        setIsLogin(true);
        setSuccessMessage("");
      }, 5000);
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
