import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();
  const [sesionIniciada, setSesionIniciada] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/productos/")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }
    const results = productos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results.slice(0, 5)); // máximo 5 sugerencias
    setShowDropdown(results.length > 0);
  }, [search, productos]);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSesionIniciada(!!localStorage.getItem("usuario"));
    // Escuchar cambios en localStorage (por ejemplo, logout en otra pestaña)
    const handleStorage = () => setSesionIniciada(!!localStorage.getItem("usuario"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [location]);

  const handleSelect = (id) => {
    setSearch('');
    setShowDropdown(false);
    navigate(`/producto/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filtered.length > 0) {
      handleSelect(filtered[0].id_producto);
    }
  };

  return (
    <header className="header">
      <div className="header-row header-main-row">
        <div className="logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Rosaline Bakery</div>
        <div className="header-search-container" ref={inputRef} style={{ position: 'relative' }}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="header-search"
              autoComplete="off"
              onFocus={() => setShowDropdown(filtered.length > 0)}
            />
          </form>
          {showDropdown && (
            <ul className="search-dropdown">
              {filtered.map(producto => (
                <li
                  key={producto.id_producto}
                  onClick={() => handleSelect(producto.id_producto)}
                  className="search-dropdown-item"
                >
                  {producto.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="header-buttons">
          <button className="header-btn" onClick={() => navigate('/carrito')}>Carrito</button>
          <button
            className="header-btn primary"
            onClick={() => {
              const usuario = JSON.parse(localStorage.getItem("usuario"));
              if (!usuario) {
                navigate('/login');
              } else if (usuario.rol === 'admin') {
                navigate('/admin');
              } else {
                navigate('/micuenta');
              }
            }}
          >
            {sesionIniciada ? 'Mi cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
      <div className="header-row header-categories-row">
        <button onClick={() => navigate('/categoria/1')} className="header-btn categoria-btn">Tradicional</button>
        <button onClick={() => navigate('/categoria/2')} className="header-btn categoria-btn">Saludable</button>
      </div>
    </header>
  );
}

export default Header;
