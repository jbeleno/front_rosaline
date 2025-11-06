import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ correo: "", contraseña: "", nombre: "", apellido: "", telefono: "", direccion: "" });
  const [error, setError] = useState("");
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
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    const result = await login(form.correo, form.contraseña);
    if (!result.success) {
      setError(result.error || "Correo o contraseña incorrectos.");
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    const result = await register(form.correo, form.contraseña, {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      direccion: form.direccion
    });
    if (!result.success) {
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
          />
          {!isLogin && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
              />
            </>
          )}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
          </button>
          {loading && <div className="login-loading">Procesando...</div>}
        </form>
        <div className="login-toggle">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <span onClick={() => setIsLogin(false)}>Regístrate</span>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setIsLogin(true)}>Inicia sesión</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
