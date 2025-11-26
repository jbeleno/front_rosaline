import React, { useEffect, useState } from "react";
import "../styles/ClienteCuenta.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt, FaChevronDown, FaChevronUp, FaBoxOpen, FaEdit, FaTimes, FaCheck, FaBox, FaTruck, FaHome, FaCreditCard, FaCalendarAlt, FaKey } from "react-icons/fa";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';
import clienteService from '../shared/services/api/clienteService';
import useAuthStore from '../features/auth/store/authStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente para mostrar el estado del pedido con un ícono y color según el estado
const EstadoPedido = ({ estado }) => {
  const getEstadoInfo = () => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return { texto: 'Pendiente', clase: 'estado-pendiente', icono: <FaBoxOpen /> };
      case 'enviado':
      case 'en camino':
        return { texto: 'En camino', clase: 'estado-enviado', icono: <FaTruck /> };
      case 'entregado':
      case 'completado':
        return { texto: 'Entregado', clase: 'estado-entregado', icono: <FaCheck /> };
      case 'cancelado':
        return { texto: 'Cancelado', clase: 'estado-cancelado', icono: <FaTimes /> };
      default:
        return { texto: estado, clase: 'estado-pendiente', icono: <FaBox /> };
    }
  };

  const estadoInfo = getEstadoInfo();

  return (
    <span className={`estado ${estadoInfo.clase}`}>
      {estadoInfo.icono} {estadoInfo.texto}
    </span>
  );
};

// Componente para mostrar un producto en la lista de pedidos
const ProductoItem = ({ producto }) => {
  // Función para obtener la URL de la imagen
  const getImagenUrl = () => {
    console.log('Datos del producto:', producto); // Para depuración
    
    // Si hay una URL de imagen directa, la usamos
    if (producto.imagen_url) {
      console.log('Usando imagen_url:', producto.imagen_url);
      return producto.imagen_url.startsWith('http') 
        ? producto.imagen_url 
        : `https://api.rosalinebakery.me${producto.imagen_url}`;
    }
    
    // Si hay un campo 'imagen' con la URL
    if (producto.imagen) {
      console.log('Usando imagen:', producto.imagen);
      return producto.imagen.startsWith('http') 
        ? producto.imagen 
        : `https://api.rosalinebakery.me${producto.imagen}`;
    }
    
    // Si hay un ID de producto, construimos la URL
    if (producto.id_producto) {
      const url = `https://api.rosalinebakery.me/productos/${producto.id_producto}/imagen`;
      console.log('Construyendo URL con id_producto:', url);
      return url;
    }
    
    console.log('No se encontró imagen, usando placeholder');
    // Si no hay imagen, mostramos un placeholder
    return 'https://via.placeholder.com/150?text=Sin+imagen';
  };

  return (
    <div className="producto-item">
      <div className="producto-imagen-container">
        <img 
          src={getImagenUrl()} 
          alt={producto.nombre} 
          className="producto-imagen-cliente" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
          }}
        />
      </div>
      <div className="producto-info">
        <h4>{producto.nombre || 'Producto sin nombre'}</h4>
        {producto.descripcion && <p className="producto-descripcion">{producto.descripcion}</p>}
        <p className="producto-cantidad">Cantidad: <strong>{producto.cantidad || 1}</strong></p>
      </div>
      <div className="producto-precio-container">
        <span className="producto-precio">${producto.precio ? producto.precio.toFixed(2) : '0.00'}</span>
        {producto.cantidad > 1 && (
          <span className="producto-subtotal">
            ${(producto.precio * producto.cantidad).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

function ClienteCuenta() {
  const [cliente, setCliente] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [productosPedido, setProductosPedido] = useState({});
  const [verMas, setVerMas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loadingUsuarioActual, setLoadingUsuarioActual] = useState(false);
  const [usuario] = useState(() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!usuario) {
      setIsLoading(false);
      return;
    }
    
    const fetchCliente = async () => {
      try {
        const cli = await clienteService.obtenerClientePorUsuario(usuario.id);
        setCliente(cli);
        setForm({
          nombre: cli.nombre,
          apellido: cli.apellido,
          telefono: cli.telefono || '',
          direccion: cli.direccion || ''
        });
      } catch (error) {
        // Si el cliente no existe (404), mostrar mensaje pero no fallar
        if (error.status === 404) {
          console.log('Cliente no encontrado - el usuario puede completar su perfil');
          setCliente(null);
          setForm({
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: ''
          });
        } else {
          console.error('Error al cargar los datos del cliente:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCliente();
  }, [usuario]);
  
  // Efecto para manejar el scroll al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!cliente || !cliente.id_cliente) return;
    
    const fetchPedidos = async () => {
      try {
        const pedidosData = await clienteService.obtenerPedidosCliente(cliente.id_cliente);
        // Asegurar que siempre sea un array
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        setPedidos([]); // Asegurar que siempre sea un array
      }
    };
    
    fetchPedidos();
  }, [cliente]);

  const handleUpdate = async e => {
    e.preventDefault();
    
    if (!cliente || !cliente.id_cliente) {
      // Si no hay cliente, crear uno nuevo
      try {
        const nuevoCliente = await clienteService.crearCliente({
          id_usuario: usuario.id,
          ...form
        });
        setCliente(nuevoCliente);
        setEdit(false);
        toast.success('✅ Perfil creado exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } catch (error) {
        console.error('Error al crear el perfil:', error);
        toast.error('❌ Error al crear el perfil. Por favor, intenta de nuevo.', {
          position: "top-right",
          autoClose: 3000
        });
      }
      return;
    }
    
    try {
      const updated = await clienteService.actualizarCliente(cliente.id_cliente, {
        id_usuario: usuario.id,
        ...form
      });
      setCliente(updated);
      setEdit(false);
      toast.success('✅ Perfil actualizado exitosamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('❌ Error al actualizar el perfil. Por favor, intenta de nuevo.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleObtenerUsuarioActual = async () => {
    setLoadingUsuarioActual(true);
    try {
      const data = await apiClient.get(API_ENDPOINTS.USUARIO_ME);
      setUsuarioActual(data);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      alert('Error al obtener usuario actual: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoadingUsuarioActual(false);
    }
  };

  const handleVerMas = async id_pedido => {
    if (productosPedido[id_pedido]) {
      setVerMas(verMas === id_pedido ? null : id_pedido);
      return;
    }
    
    try {
      const productos = await apiClient.get(`${API_ENDPOINTS.PEDIDO_BY_ID(id_pedido)}/productos`);
      console.log('Productos del pedido:', productos); // Depuración
      setProductosPedido(prev => ({ ...prev, [id_pedido]: productos }));
      setVerMas(id_pedido);
    } catch (error) {
      console.error('Error al obtener productos del pedido:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="cliente-cuenta-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tu información...</p>
        </div>
      </div>
    );
  }

  // Si no hay cliente después de cargar, mostrar formulario para crear perfil
  if (!cliente) {
    return (
      <div className="cliente-cuenta-container">
        <h2>Mi Cuenta</h2>
        
        <button 
          onClick={() => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            navigate("/");
          }} 
          className="button button-danger"
          style={{ position: 'absolute', top: '2.5rem', right: '2.5rem' }}
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
        
        <div className="cliente-info-card">
          <h3>Completa tu perfil</h3>
          <p>Para continuar, necesitamos que completes tu información personal.</p>
          
          <form onSubmit={handleUpdate} className="cliente-form">
            <div className="form-group">
              <label>Nombre</label>
              <input 
                value={form.nombre || ''} 
                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Tu nombre" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Apellido</label>
              <input 
                value={form.apellido || ''} 
                onChange={e => setForm({ ...form, apellido: e.target.value })} 
                placeholder="Tu apellido" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel"
                value={form.telefono || ''} 
                onChange={e => setForm({ ...form, telefono: e.target.value })} 
                placeholder="Tu teléfono" 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección de envío</label>
              <input 
                value={form.direccion || ''} 
                onChange={e => setForm({ ...form, direccion: e.target.value })} 
                placeholder="Tu dirección" 
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="button button-primary">
                <FaCheck /> Crear perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const formatFecha = (fechaString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(fechaString).toLocaleDateString('es-ES', options);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="cliente-cuenta-container">
      <ToastContainer />
      <h2>Mi Cuenta</h2>
      
      <button 
        onClick={handleLogout} 
        className="button button-danger"
        style={{ position: 'absolute', top: '2.5rem', right: '2.5rem' }}
      >
        <FaSignOutAlt /> Cerrar sesión
      </button>
      
      <div className="cliente-info-card">
        <h3>Información Personal</h3>
        
        <div style={{marginBottom: '2rem', padding: '1.5rem', background: '#f3e5f5', borderRadius: '8px'}}>
          <h4 style={{marginBottom: '1rem', color: '#6C3483'}}>Mi Información de Usuario</h4>
          <button 
            onClick={handleObtenerUsuarioActual} 
            disabled={loadingUsuarioActual}
            className="button button-primary"
            style={{marginBottom: usuarioActual ? '1rem' : '0'}}
          >
            {loadingUsuarioActual ? 'Cargando...' : 'Ver mi información de usuario'}
          </button>
          {usuarioActual && (
            <div style={{padding: '1rem', background: 'white', borderRadius: '6px', marginTop: '1rem'}}>
              <p style={{margin: '0.5rem 0'}}><strong>ID Usuario:</strong> {usuarioActual.id_usuario}</p>
              <p style={{margin: '0.5rem 0'}}><strong>Correo:</strong> {usuarioActual.sub}</p>
              <p style={{margin: '0.5rem 0'}}><strong>Rol:</strong> {usuarioActual.rol}</p>
            </div>
          )}
        </div>
        
        {edit ? (
          <form onSubmit={handleUpdate} className="cliente-form">
            <div className="form-group">
              <label>Nombre</label>
              <input 
                value={form.nombre} 
                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Tu nombre" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Apellido</label>
              <input 
                value={form.apellido} 
                onChange={e => setForm({ ...form, apellido: e.target.value })} 
                placeholder="Tu apellido" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel"
                value={form.telefono} 
                onChange={e => setForm({ ...form, telefono: e.target.value })} 
                placeholder="Tu teléfono" 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección de envío</label>
              <input 
                value={form.direccion} 
                onChange={e => setForm({ ...form, direccion: e.target.value })} 
                placeholder="Tu dirección" 
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="button button-primary">
                <FaCheck /> Guardar cambios
              </button>
              <button 
                type="button" 
                className="button button-outline"
                onClick={() => setEdit(false)}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <p><b><FaUserEdit /> Nombre:</b> {cliente.nombre}</p>
            <p><b><FaUserEdit /> Apellido:</b> {cliente.apellido}</p>
            <p><b>📞 Teléfono:</b> {cliente.telefono || 'No especificado'}</p>
            <p><b><FaHome /> Dirección:</b> {cliente.direccion || 'No especificada'}</p>
            
            <div className="button-group">
              <button 
                onClick={() => setEdit(true)} 
                className="button button-primary"
              >
                <FaEdit /> Editar información
              </button>
              {/* Botón de cambiar contraseña eliminado */}
            </div>
          </>
        )}
      </div>

      <div className="pedidos-lista">
        <h3><FaBox /> Mis Pedidos</h3>
        
        {pedidos.length === 0 ? (
          <div className="sin-pedidos">
            <FaBoxOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Aún no tienes pedidos realizados</p>
            <button 
              className="button button-primary" 
              onClick={() => navigate('/productos')}
              style={{ marginTop: '1rem' }}
            >
              Ver productos
            </button>
          </div>
        ) : (
          Array.isArray(pedidos) && pedidos.map(pedido => (
            <div key={pedido.id_pedido} className="pedido-card">
              <div className="pedido-header">
                <p><b>Pedido #</b> {pedido.id_pedido}</p>
                <p><b><FaCalendarAlt /> Fecha:</b> {formatFecha(pedido.fecha_pedido)}</p>
                <p><b><FaHome /> Dirección:</b> {pedido.direccion_envio || cliente.direccion}</p>
                <p><b><FaCreditCard /> Pago:</b> {pedido.metodo_pago || 'No especificado'}</p>
                <p className="estado-container">
                  <b>Estado:</b> <EstadoPedido estado={pedido.estado} />
                </p>
              </div>
              
              <button 
                className="ver-mas-btn"
                onClick={() => handleVerMas(pedido.id_pedido)}
              >
                {verMas === pedido.id_pedido ? (
                  <>
                    <span>Ocultar productos</span>
                    <FaChevronUp />
                  </>
                ) : (
                  <>
                    <span>Ver productos</span>
                    <FaChevronDown />
                  </>
                )}
              </button>
              
              {verMas === pedido.id_pedido && productosPedido[pedido.id_pedido] && (
                <div className="productos-lista">
                  <h4>Productos en este pedido:</h4>
                  {productosPedido[pedido.id_pedido].map((prod, index) => (
                    <ProductoItem key={`${prod.id_producto}-${index}`} producto={prod} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClienteCuenta;
