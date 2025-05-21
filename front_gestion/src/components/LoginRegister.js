import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ correo: "", contraseña: "", nombre: "", apellido: "", telefono: "", direccion: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si ya hay sesión, redirige a home
  useEffect(() => {
    if (localStorage.getItem("usuario")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://backrosaline-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: form.correo,
          contraseña: form.contraseña
        })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        // Decodificar el token para obtener datos del usuario
        const decoded = jwtDecode(data.access_token);
        localStorage.setItem("usuario", JSON.stringify({
          id: decoded.id_usuario,
          correo: decoded.sub,
          rol: decoded.rol
        }));
        navigate("/");
      } else if (res.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión.");
      }
    } catch {
      setError("Error al iniciar sesión.");
    }
    setLoading(false);
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Crear usuario
      const usuarioRes = await fetch("https://backrosaline-production.up.railway.app/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: form.correo,
          contraseña: form.contraseña,
          rol: "cliente"
        })
      });
      if (!usuarioRes.ok) {
        setError("El correo ya está registrado.");
        setLoading(false);
        return;
      }
      const usuario = await usuarioRes.json();

      // 2. Crear cliente
      const clienteRes = await fetch("https://backrosaline-production.up.railway.app/clientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion
        })
      });
      if (!clienteRes.ok) {
        setError("Error al crear el cliente.");
        setLoading(false);
        return;
      }
      await clienteRes.json();
      localStorage.setItem("usuario", JSON.stringify({
        id: usuario.id_usuario,
        rol: usuario.rol
      }));
      navigate("/");
    } catch {
      setError("Error al registrarse.");
    }
    setLoading(false);
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
