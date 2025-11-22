import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../features/products/hooks/useProducts';
import { useCart } from '../features/cart/hooks/useCart';
import useAuthStore from '../features/auth/store/authStore';
import { LoadingSpinner } from '../shared/components/UI/LoadingSpinner';
import { ErrorMessage } from '../shared/components/UI/ErrorMessage';
import { FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProductosList.css';

export default function ProductosList() {
  const navigate = useNavigate();
  const { productos, loading, error, refetch } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated, cliente } = useAuthStore();

  const handleAddToCart = async (producto) => {
    // Verificar autenticación
    if (!isAuthenticated) {
      toast.info('Por favor inicia sesión para agregar productos al carrito', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    // Verificar que exista el cliente
    if (!cliente || !cliente.id_cliente) {
      toast.error('Error: No se pudo obtener la información del cliente. Por favor, completa tu perfil.', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/micuenta');
      return;
    }

    try {
      await addToCart(producto, 1, cliente.id_cliente);
      toast.success(`¡${producto.nombre} agregado al carrito!`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar al carrito: ' + (error.message || 'Error desconocido'), {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleViewDetails = (id_producto) => {
    navigate(`/producto/${id_producto}`);
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
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="productos-list-container">
      <h1 className="productos-title">Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => (
          <div 
            key={producto.id_producto} 
            className="producto-card"
            onClick={() => handleViewDetails(producto.id_producto)}
            style={{ cursor: 'pointer' }}
          >
            {/* Imagen del producto */}
            <div className="producto-imagen-wrapper">
              {producto.imagen_url ? (
                <img 
                  src={producto.imagen_url} 
                  alt={producto.nombre}
                  className="producto-imagen"
                  loading="lazy"
                />
              ) : (
                <div className="producto-imagen-placeholder">
                  📷
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
        ))}
      </div>
      {productos.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          No hay productos disponibles
        </p>
      )}
    </div>
    </>
  );
}
