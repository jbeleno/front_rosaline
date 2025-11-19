import React, { useEffect, useState, useRef } from "react";
import "../styles/Carrito.css";
import { useNavigate } from "react-router-dom";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';

function Carrito() {
  const [usuario] = useState(() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  });
  const [cliente, setCliente] = useState(null);
  const [carrito, setCarrito] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const paypalRef = useRef();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Obtener cliente cuando cambia el usuario
  useEffect(() => {
    if (!usuario) return;
    const fetchCliente = async () => {
      try {
        const clienteData = await apiClient.get(API_ENDPOINTS.CLIENTE_BY_USUARIO(usuario.id));
        setCliente(clienteData);
      } catch (error) {
        console.error('Error al obtener el cliente:', error);
        setCliente(null);
      }
    };
    fetchCliente();
  }, [usuario]);

  // Obtener carrito cuando cambia el cliente
  useEffect(() => {
    if (!cliente || !cliente.id_cliente) return;
    
    const fetchCarrito = async () => {
      try {
        const carritos = await apiClient.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(cliente.id_cliente));
        
        // Verificar si la respuesta es un array
        const carritosArray = Array.isArray(carritos) ? carritos : [];
        const carritoActivo = carritosArray.find(c => c.estado === "activo");
        
        setCarrito(carritoActivo || null);
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        setCarrito(null);
      }
    };
    
    fetchCarrito();
  }, [cliente]);

  // Obtener productos del carrito cuando cambia el carrito
  useEffect(() => {
    if (!carrito) {
      setDetalles([]);
      setProductos([]);
      return;
    }
    
    const fetchProductosCarrito = async () => {
      try {
        // Usar el endpoint específico que devuelve los productos del carrito
        const productosCarrito = await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_CARRITO(carrito.id_carrito));
        
        // Obtener los detalles del carrito para tener la cantidad
        const detallesAll = await apiClient.get(API_ENDPOINTS.DETALLE_CARRITO);
        const detallesCarrito = detallesAll.filter(d => d.id_carrito === carrito.id_carrito);
        
        setProductos(Array.isArray(productosCarrito) ? productosCarrito : []);
        setDetalles(detallesCarrito);
      } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        setDetalles([]);
        setProductos([]);
      }
    };
    
    fetchProductosCarrito();
  }, [carrito]);

  // 3. Calcular total
  useEffect(() => {
    let t = 0;
    detalles.forEach((d, i) => {
      if (productos[i]) t += productos[i].precio * d.cantidad;
    });
    setTotal(t);
  }, [detalles, productos]);

  // Cargar el SDK de PayPal solo una vez
  useEffect(() => {
    if (paypalLoaded || detalles.length === 0 || !total) return;
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AUGasCkqQ6YtrdaaZkxDJ29J_KY5sj_4Tt-b4quCGesP6Vam_PhSsD9VxAtMQyAekm6E76mIdEoYA1DI&currency=USD";
    script.addEventListener("load", () => setPaypalLoaded(true));
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [paypalLoaded, detalles.length, total]);

  // Renderizar los botones de PayPal cuando el SDK esté cargado
  useEffect(() => {
    if (!paypalLoaded || detalles.length === 0 || !total || !paypalRef.current) return;
    // Guarda la referencia actual
    const currentPaypalRef = paypalRef.current;
    // Limpiar el contenedor antes de renderizar
    currentPaypalRef.innerHTML = "";
    const paypalButtons = window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2) }
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          await actions.order.capture();
          // 1. Obtener cliente
          const usuario = JSON.parse(localStorage.getItem("usuario"));
          const clienteData = await apiClient.get(API_ENDPOINTS.CLIENTE_BY_USUARIO(usuario.id));
          
          // 2. Crear el pedido en el backend
          const pedido = await apiClient.post(API_ENDPOINTS.PEDIDOS, {
            id_cliente: clienteData.id_cliente,
            estado: "Pago confirmado",
            direccion_envio: clienteData.direccion,
            metodo_pago: "PayPal"
          });
          
          // 3. Crear los detalles de pedido
          for (let i = 0; i < detalles.length; i++) {
            await apiClient.post(API_ENDPOINTS.DETALLE_PEDIDOS, {
              id_pedido: pedido.id_pedido,
              id_producto: detalles[i].id_producto,
              cantidad: detalles[i].cantidad,
              precio_unitario: productos[i].precio
            });
          }
          
          // 4. Eliminar los detalles del carrito (vaciar carrito)
          for (let i = 0; i < detalles.length; i++) {
            await apiClient.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalles[i].id_detalle_carrito));
          }
          
          // 5. Redirigir a la vista de confirmación
          navigate(`/pedido-confirmado/${pedido.id_pedido}`);
        } catch (error) {
          console.error('Error al procesar el pago:', error);
          alert('Error al procesar el pago. Por favor, intenta de nuevo.');
        }
      }
    });
    paypalButtons.render(currentPaypalRef);

    // Limpieza al desmontar
    return () => {
      try {
        paypalButtons.close();
      } catch (e) {
        // Silenciar error si el botón ya no existe
      }
      if (currentPaypalRef) currentPaypalRef.innerHTML = "";
    };
  }, [paypalLoaded, detalles, total, productos, navigate]);

  // 4. Eliminar producto del carrito de forma instantánea
  const handleEliminar = async (id_detalle) => {
    try {
      await apiClient.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(id_detalle));
      
      // Actualizar el estado local en lugar de recargar la página
      setDetalles(detalles.filter(d => d.id_detalle_carrito !== id_detalle));
      
      // Si no quedan detalles, limpiar productos también
      const nuevosDetalles = detalles.filter(d => d.id_detalle_carrito !== id_detalle);
      if (nuevosDetalles.length === 0) {
        setProductos([]);
      } else {
        // Actualizar productos para reflejar los cambios
        const productosCarrito = await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_CARRITO(carrito.id_carrito));
        setProductos(Array.isArray(productosCarrito) ? productosCarrito : []);
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      alert("No se pudo eliminar el producto del carrito.");
    }
  };

  if (!usuario) return (
    <div className="carrito-container">
      <div>
        <h2>Inicia sesión</h2>
        <p>Debes iniciar sesión para ver tu carrito de compras.</p>
        <button 
          className="carrito-btn-finalizar" 
          onClick={() => navigate('/login')}
          style={{ marginTop: '1.5rem' }}
        >
          Ir al inicio de sesión
        </button>
      </div>
    </div>
  );

  if (!carrito) return (
    <div className="carrito-container">
      <div>
        <h2>Buscando tu carrito...</h2>
        <p>Estamos preparando todo para ti.</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );

  if (detalles.length === 0) return (
    <div className="carrito-container">
      <div>
        <h2>¡Tu carrito está vacío!</h2>
        <p>Parece que aún no has agregado productos a tu carrito.</p>
        <button 
          className="carrito-btn-finalizar" 
          onClick={() => navigate('/catalogo')}
          style={{ marginTop: '1.5rem' }}
        >
          Explorar productos
        </button>
      </div>
    </div>
  );

  return (
    <div className="carrito-container">
      <h2>Mi Pedido</h2>
      <ul className="carrito-lista">
        {detalles.map((detalle, i) => {
          const producto = productos[i];
          const subtotal = producto ? (producto.precio * detalle.cantidad).toFixed(2) : '0.00';
          
          return (
            <li key={detalle.id_detalle_carrito} className="carrito-item">
              <div className="carrito-img">
                {producto?.imagen_url ? (
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = 
                        `<div class="carrito-img-placeholder">${producto.nombre.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="carrito-img-placeholder">
                    {producto?.nombre ? producto.nombre.charAt(0).toUpperCase() : 'P'}
                  </div>
                )}
              </div>
              <div className="carrito-info">
                <h3 className="carrito-nombre">{producto?.nombre || 'Producto no disponible'}</h3>
                <div className="carrito-precio">{producto?.precio?.toFixed(2) || '0.00'}</div>
                
                <div className="carrito-cantidad">
                  <label>Cantidad: </label>
                  <span>{detalle.cantidad}</span>
                </div>
                
                <div className="carrito-subtotal">
                  Subtotal: <span>${subtotal}</span>
                </div>
                
                <button 
                  className="carrito-btn-eliminar" 
                  onClick={() => handleEliminar(detalle.id_detalle_carrito)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      
      <div className="carrito-total">
        <span>Total a pagar:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {/* Botón de PayPal */}
      {detalles.length > 0 && <div ref={paypalRef}></div>}
    </div>
  );
}

export default Carrito;
