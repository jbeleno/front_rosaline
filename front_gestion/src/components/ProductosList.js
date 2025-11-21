import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../features/products/hooks/useProducts';
import { useCart } from '../features/cart/hooks/useCart';
import useAuthStore from '../features/auth/store/authStore';
import { LoadingSpinner } from '../shared/components/UI/LoadingSpinner';
import { ErrorMessage } from '../shared/components/UI/ErrorMessage';
import { FaShoppingCart } from 'react-icons/fa';
import '../styles/ProductosList.css';

export default function ProductosList() {
  const navigate = useNavigate();
  const { productos, loading, error, refetch } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated, cliente } = useAuthStore();
  const [imageErrors, setImageErrors] = useState({});

  const handleAddToCart = async (producto) => {
    // Verificar autenticación
    if (!isAuthenticated) {
      alert('Por favor inicia sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    // Verificar que exista el cliente
    if (!cliente || !cliente.id_cliente) {
      alert('Error: No se pudo obtener la información del cliente. Por favor, completa tu perfil.');
      navigate('/micuenta');
      return;
    }

    try {
      await addToCart(producto, 1, cliente.id_cliente);
      alert(`${producto.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleViewDetails = (id_producto) => {
    navigate(`/producto/${id_producto}`);
  };

  const handleImageError = (productoId) => {
    setImageErrors(prev => ({ ...prev, [productoId]: true }));
  };

  const getImageUrl = (producto) => {
    // Si hay error previo o no hay imagen_url, retornar null
    if (imageErrors[producto.id_producto] || !producto.imagen_url) {
      return null;
    }
    
    // Verificar si la URL es válida
    try {
      const url = new URL(producto.imagen_url);
      return url.href;
    } catch (e) {
      // Si no es una URL válida, intentar construirla
      if (producto.imagen_url.startsWith('http')) {
        return producto.imagen_url;
      }
      return null;
    }
  };

  if (loading) {
    return (
      <div className="productos-list-container">
        <LoadingSpinner message="Cargando productos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-list-container">
        <ErrorMessage 
          message="Error al cargar productos" 
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="productos-list-container">
      <h1 className="productos-title">Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => {
          const imageUrl = getImageUrl(producto);
          const hasError = imageErrors[producto.id_producto];
          
          return (
            <div 
              key={producto.id_producto} 
              className="producto-card"
              onClick={() => handleViewDetails(producto.id_producto)}
              style={{ cursor: 'pointer' }}
            >
              {/* Imagen del producto */}
              <div className="producto-imagen-wrapper">
                {imageUrl && !hasError ? (
                  <img 
                    src={imageUrl} 
                    alt={producto.nombre}
                    className="producto-imagen"
                    loading="lazy"
                    onError={() => handleImageError(producto.id_producto)}
                  />
                ) : (
                  <div className="producto-imagen-placeholder">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>

            {/* Información del producto */}
            <div className="producto-info">
              <h2 className="producto-nombre">{producto.nombre}</h2>
              {producto.descripcion && (
                <p className="producto-descripcion">
                  {producto.descripcion.substring(0, 80)}
                  {producto.descripcion.length > 80 ? '...' : ''}
                </p>
              )}
              <p className="producto-precio">${producto.precio?.toLocaleString()}</p>
              
              {/* Stock */}
              {producto.cantidad !== undefined && (
                <p className="producto-stock">
                  {producto.cantidad > 0 ? (
                    <span style={{ color: '#27ae60' }}>✓ En stock ({producto.cantidad})</span>
                  ) : (
                    <span style={{ color: '#e74c3c' }}>✗ Agotado</span>
                  )}
                </p>
              )}

              {/* Botón agregar al carrito */}
              <button
                className="producto-btn-carrito"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(producto);
                }}
                disabled={producto.cantidad === 0}
              >
                <FaShoppingCart /> Agregar al carrito
              </button>
            </div>
          </div>
        )})}
      </div>
      {productos.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          No hay productos disponibles
        </p>
      )}
    </div>
  );
}
