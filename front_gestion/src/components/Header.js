import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../features/products/hooks/useProducts';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCart } from '../features/cart/hooks/useCart';
import { debounce } from '../shared/utils/helpers';
import '../styles/Header.css';

// Import Poppins font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();
  const { productos } = useProducts();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  // Filtrar productos según búsqueda
  const filtered = useMemo(() => {
    if (search.trim() === '') {
      return [];
    }
    return productos
      .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5); // máximo 5 sugerencias
  }, [search, productos]);

  // Mostrar dropdown cuando hay resultados
  useEffect(() => {
    setShowDropdown(filtered.length > 0 && search.trim() !== '');
  }, [filtered, search]);

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

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header">
      <div className="header-row header-main-row">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src="/img/logo.png" alt="Rosaline Bakery Logo" className="logo-img" />
          <span className="logo-text">Rosaline Bakery</span>
        </div>
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
              <ul className={`search-dropdown ${showDropdown ? 'active' : ''}`}>
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
          {isAuthenticated && (
            <button className="header-btn" onClick={() => navigate('/carrito')}>
              Carrito {itemCount > 0 && `(${itemCount})`}
            </button>
          )}
          <button
            className="header-btn primary"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else if (isAdmin) {
                navigate('/admin');
              } else {
                navigate('/micuenta');
              }
            }}
          >
            {isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}
          </button>
          {isAuthenticated && (
            <button
              className="header-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{ marginLeft: '0.5rem' }}
            >
              Salir
            </button>
          )}
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
