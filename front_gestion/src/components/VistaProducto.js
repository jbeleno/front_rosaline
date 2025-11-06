import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../features/products/hooks/useProduct";
import { useCart } from "../features/cart/hooks/useCart";
import { useAuth } from "../features/auth/hooks/useAuth";
import { LoadingSpinner } from "../shared/components/UI/LoadingSpinner";
import { ErrorMessage } from "../shared/components/UI/ErrorMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/VistaProducto.css";

function VistaProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated, cliente } = useAuth();
  const [cantidad, setCantidad] = useState(1);

  const handleAddToCart = async (goToCart = false) => {
    if (!isAuthenticated) {
      toast.info('Por favor inicia sesión para continuar', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    if (!cliente?.id_cliente) {
      toast.error('Error: No se pudo obtener la información del cliente');
      return;
    }

    try {
      await addToCart(product, cantidad, cliente.id_cliente);
      
      if (goToCart) {
        toast.success('Redirigiendo al carrito...', {
          position: "top-center",
          autoClose: 1500,
          onClose: () => navigate('/carrito')
        });
      } else {
        toast.success('¡Producto añadido al carrito!', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error('Error al agregar el producto al carrito', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="vista-producto-container">
        <LoadingSpinner message="Cargando producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="vista-producto-container">
        <ErrorMessage 
          message={error || 'Producto no encontrado'}
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
      <div className="vista-producto-container">
      <div className="vista-producto-img">
        {product.imagen_url ? (
          <div style={{ width: '430px', height: '430px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
            <img
              src={product.imagen_url}
              alt={product.nombre}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: '10px'
              }}
              onError={(e) => {
                console.error('Error al cargar la imagen:', product.imagen_url);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/250?text=Imagen+no+disponible';
              }}
            />
          </div>
        ) : (
          <div className="vista-producto-img-placeholder">Imagen</div>
        )}
      </div>
      <div className="vista-producto-info">
        <h1>{product.nombre}</h1>
        <p className="vista-producto-desc">{product.descripcion}</p>
        <p className="vista-producto-precio">${product.precio}</p>
        {product.cantidad > 0 ? (
          <>
            <div className="vista-producto-cantidad">
              <label>Cantidad: </label>
              <input
                type="number"
                min="1"
                max={product.cantidad}
                value={cantidad}
                onChange={e => {
                  const val = Math.max(1, Math.min(product.cantidad, Number(e.target.value)));
                  setCantidad(val);
                }}
                disabled={cartLoading}
              />
            </div>
            <div className="vista-producto-botones">
              <button 
                className="vista-producto-btn comprar" 
                onClick={() => handleAddToCart(true)}
                disabled={cartLoading}
              >
                {cartLoading ? 'Procesando...' : 'Comprar'}
              </button>
              <button 
                className="vista-producto-btn carrito" 
                onClick={() => handleAddToCart(false)}
                disabled={cartLoading}
              >
                {cartLoading ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>
          </>
        ) : (
          <div className="vista-producto-agotado">Agotado</div>
        )}
      </div>
      </div>
    </>
  );
}

export default VistaProducto;
