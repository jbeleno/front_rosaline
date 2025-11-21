import React, { useState, useEffect } from "react";
import "../styles/AdminCuenta.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';
import useAuthStore from '../features/auth/store/authStore';

const ESTADOS = [
  "Pago confirmado",
  "En preparación",
  "En domicilio",
  "Listo para recoger",
  "Entregado"
];

function AdminCuenta() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("productos");
  const [uploading, setUploading] = useState(false);

  // Productos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", descripcion: "", cantidad: 0, precio: 0, id_categoria: "", imagen_url: "", estado: "activo" });
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [productoEdit, setProductoEdit] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // Categorías
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion_corta: "", descripcion_larga: "", estado: "activo" });
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState({});

  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [verMasId, setVerMasId] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState({});
  const [editandoEstadoId, setEditandoEstadoId] = useState(null);

  // Usuarios
  const [usuarioData, setUsuarioData] = useState({ id: "", correo: "", contraseña: "", rol: "", email_verificado: "" });
  const [deleteUsuarioId, setDeleteUsuarioId] = useState("");
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loadingUsuarioActual, setLoadingUsuarioActual] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroEmailVerificado, setFiltroEmailVerificado] = useState("");
  const [paginacion, setPaginacion] = useState({ skip: 0, limit: 50 });

  // Clientes
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showDeleteClienteModal, setShowDeleteClienteModal] = useState(false);
  const [deleteClienteId, setDeleteClienteId] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [paginacionClientes, setPaginacionClientes] = useState({ skip: 0, limit: 50 });

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  // Cerrar sesión
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, pedidosData] = await Promise.all([
          apiClient.get(API_ENDPOINTS.PRODUCTOS),
          apiClient.get(API_ENDPOINTS.CATEGORIAS),
          apiClient.get(API_ENDPOINTS.PEDIDOS)
        ]);
        setProductos(Array.isArray(productosData) ? productosData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setPedidos([]); // Asegurar que siempre sea un array
      }
    };
    fetchData();
  }, []);

  // Filtrar pedidos por estado
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        let pedidosData;
        if (filtroEstado) {
          pedidosData = await apiClient.get(API_ENDPOINTS.PEDIDOS_BY_ESTADO(filtroEstado));
        } else {
          pedidosData = await apiClient.get(API_ENDPOINTS.PEDIDOS);
        }
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setPedidos([]); // Asegurar que siempre sea un array
      }
    };
    fetchPedidos();
  }, [filtroEstado]);

  // Función para subir imagen a Supabase
  const uploadImage = async (file, id_producto) => {
    try {
      setUploading(true);
      
      // Usar el formato con doble barra en la ruta
      const fileName = `//producto_${id_producto}.jpg`;
      const filePath = fileName;

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública sin timestamp
      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Manejador para el cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // CRUD Productos
  const handleCrearProducto = async e => {
    e.preventDefault();
    
    try {
      // 1. Crear el producto primero para obtener el id
      const prod = await apiClient.post(API_ENDPOINTS.PRODUCTOS, { ...nuevoProducto, imagen_url: "" });
      
      // 2. Si hay archivo, subirlo con el id del producto
      let imagenUrl = "";
      if (selectedFile) {
        imagenUrl = await uploadImage(selectedFile, prod.id_producto);
        if (!imagenUrl) {
          // Si falla la subida de la imagen, eliminar el producto creado
          await apiClient.delete(API_ENDPOINTS.PRODUCTO_BY_ID(prod.id_producto));
          return;
        }
        
        // Actualizar el producto con la url de la imagen
        const updatedProd = await apiClient.put(API_ENDPOINTS.PRODUCTO_BY_ID(prod.id_producto), {
          ...prod,
          imagen_url: imagenUrl
        });
        
        setProductos([...productos, updatedProd]);
      } else {
        setProductos([...productos, prod]);
      }

      setNuevoProducto({ 
        nombre: "", 
        descripcion: "", 
        cantidad: 0, 
        precio: 0, 
        id_categoria: "", 
        imagen_url: "",
        estado: "activo"
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Error al crear el producto');
    }
  };

  const handleActualizarProducto = async id => {
    try {
      let imagenUrl = productoEdit.imagen_url;
      
      // Si hay un archivo seleccionado, eliminar la imagen antigua y subir la nueva
      if (selectedFile) {
        // 1. Eliminar la imagen antigua si existe
        if (productoEdit.imagen_url) {
          // Intentar eliminar con diferentes extensiones comunes
          const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
          const baseFileName = `//producto_${id}`;
          
          // Crear array de nombres de archivo a eliminar
          const filesToDelete = extensions.map(ext => `${baseFileName}${ext}`);
          
          // Eliminar todos los posibles archivos
          const { error: deleteError } = await supabase.storage
            .from('productos')
            .remove(filesToDelete);

          if (deleteError) {
            console.error('Error al eliminar la imagen antigua:', deleteError);
          }
        }

        // 2. Subir la nueva imagen
        imagenUrl = await uploadImage(selectedFile, id);
        if (!imagenUrl) {
          alert('Error al subir la imagen');
          return;
        }
      }

      const productoData = {
        ...productoEdit,
        imagen_url: imagenUrl
      };

      const actualizado = await apiClient.put(API_ENDPOINTS.PRODUCTO_BY_ID(id), productoData);
      
      // Actualizar la lista de productos
      setProductos(productos.map(p => p.id_producto === id ? actualizado : p));
      setEditandoProducto(null);
      setProductoEdit({});
      setSelectedFile(null);
      
      // Recargar la lista completa de productos para asegurar que todo está actualizado
      const productosActualizados = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleEditarClick = prod => {
    setEditandoProducto(prod.id_producto);
    setProductoEdit({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      cantidad: prod.cantidad,
      precio: prod.precio,
      id_categoria: prod.id_categoria,
      imagen_url: prod.imagen_url,
      estado: prod.estado || "activo"
    });
  };

  const handleEliminarProducto = async id => {
    try {
      // 1. Obtener el producto del estado actual
      const producto = productos.find(p => p.id_producto === id);
      if (!producto) throw new Error('Producto no encontrado');

      // 2. Si el producto tiene una imagen, eliminarla de Supabase
      if (producto.imagen_url) {
        console.log('Intentando eliminar imagen para producto:', id);
        console.log('URL de la imagen:', producto.imagen_url);

        // Construir el nombre del archivo sin las barras iniciales
        const fileName = `producto_${id}.jpg`;
        console.log('Nombre del archivo a eliminar:', fileName);

        // Intentar eliminar el archivo
        const { data, error: deleteError } = await supabase.storage
          .from('productos')
          .remove([fileName]);

        if (deleteError) {
          console.error('Error al eliminar la imagen:', deleteError);
          throw new Error('Error al eliminar la imagen del producto: ' + deleteError.message);
        }

        console.log('Resultado de la eliminación:', data);
      }

      // 3. Eliminar el producto de la base de datos
      await apiClient.delete(API_ENDPOINTS.PRODUCTO_BY_ID(id));

      // 4. Actualizar la lista de productos
      const productosActualizados = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto: ' + error.message);
    }
  };

  // CRUD Categorías
  const handleCrearCategoria = async e => {
    e.preventDefault();
    try {
      const cat = await apiClient.post(API_ENDPOINTS.CATEGORIAS, nuevaCategoria);
      setCategorias([...categorias, cat]);
      setNuevaCategoria({ nombre: "", descripcion_corta: "", descripcion_larga: "", estado: "activo" });
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      alert('Error al crear la categoría');
    }
  };

  const handleEliminarCategoria = async id => {
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORIA_BY_ID(id));
      setCategorias(categorias.filter(c => c.id_categoria !== id));
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleEditarCategoriaClick = cat => {
    setEditandoCategoria(cat.id_categoria);
    setCategoriaEdit({
      nombre: cat.nombre,
      descripcion_corta: cat.descripcion_corta,
      descripcion_larga: cat.descripcion_larga,
      estado: cat.estado || "activo"
    });
  };

  const handleActualizarCategoria = async id => {
    try {
      const actualizada = await apiClient.put(API_ENDPOINTS.CATEGORIA_BY_ID(id), categoriaEdit);
      setCategorias(categorias.map(c => c.id_categoria === id ? actualizada : c));
      setEditandoCategoria(null);
      setCategoriaEdit({});
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      alert('Error al actualizar la categoría');
    }
  };

  // Actualizar estado de pedido
  const handleActualizarEstado = async (id_pedido, nuevoEstado) => {
    const pedido = pedidos.find(p => p.id_pedido === id_pedido);
    if (!pedido) return;
    
    try {
      const updated = await apiClient.put(API_ENDPOINTS.PEDIDO_BY_ID(id_pedido), {
        ...pedido,
        estado: nuevoEstado
      });
      setPedidos(pedidos.map(p => p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  // CRUD Usuarios
  const handleObtenerUsuarioActual = async () => {
    setLoadingUsuarioActual(true);
    try {
      const data = await apiClient.get(API_ENDPOINTS.USUARIO_ME);
      setUsuarioActual(data);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      setErrorMessage('Error al obtener usuario actual: ' + (error.message || 'Error desconocido'));
      setShowErrorModal(true);
    } finally {
      setLoadingUsuarioActual(false);
    }
  };

  const handleCargarUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const params = new URLSearchParams();
      params.append('skip', paginacion.skip.toString());
      params.append('limit', paginacion.limit.toString());
      if (filtroRol) params.append('rol', filtroRol);
      if (filtroCorreo) params.append('correo', filtroCorreo);
      if (filtroEmailVerificado) params.append('email_verificado', filtroEmailVerificado);

      const data = await apiClient.get(`${API_ENDPOINTS.USUARIOS}?${params.toString()}`);
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setErrorMessage('Error al cargar la lista de usuarios: ' + (error.message || 'Error desconocido'));
      setShowErrorModal(true);
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // CRUD Clientes
  const handleCargarClientes = async () => {
    setLoadingClientes(true);
    try {
      const params = new URLSearchParams();
      params.append('skip', paginacionClientes.skip.toString());
      params.append('limit', paginacionClientes.limit.toString());

      const data = await apiClient.get(`${API_ENDPOINTS.CLIENTES}?${params.toString()}`);
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setErrorMessage('Error al cargar la lista de clientes: ' + (error.message || 'Error desconocido'));
      setShowErrorModal(true);
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleVerDetallesCliente = async (id) => {
    try {
      const data = await apiClient.get(API_ENDPOINTS.CLIENTE_BY_ID(id));
      setClienteSeleccionado(data);
    } catch (error) {
      console.error('Error al obtener detalles del cliente:', error);
      setErrorMessage('Error al obtener detalles del cliente: ' + (error.message || 'Error desconocido'));
      setShowErrorModal(true);
    }
  };

  const handleEliminarCliente = async () => {
    try {
      await apiClient.delete(API_ENDPOINTS.CLIENTE_BY_ID(deleteClienteId));
      setShowDeleteClienteModal(false);
      setSuccessMessage('Cliente eliminado exitosamente');
      setShowSuccessModal(true);
      setDeleteClienteId("");
      setClienteSeleccionado(null);
      // Recargar lista de clientes
      handleCargarClientes();
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      setShowDeleteClienteModal(false);
      
      if (error.status === 404 || error.status === 500) {
        setErrorMessage(`El cliente con ID ${deleteClienteId} no existe o ya fue eliminado.`);
      } else if (error.message && error.message.toLowerCase().includes('fetch')) {
        setErrorMessage(`No se pudo conectar con el servidor. Verifica que el cliente con ID ${deleteClienteId} exista.`);
      } else {
        setErrorMessage(error.message || 'Error desconocido al eliminar el cliente');
      }
      setShowErrorModal(true);
    }
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioData.id) {
      setErrorMessage('Por favor ingresa el ID del usuario');
      setShowErrorModal(true);
      return;
    }
    try {
      // Construir objeto solo con campos que tienen valor (todos opcionales)
      const dataToSend = {};
      
      if (usuarioData.correo && usuarioData.correo.trim()) {
        dataToSend.correo = usuarioData.correo.trim();
      }
      if (usuarioData.contraseña && usuarioData.contraseña.trim()) {
        dataToSend.contraseña = usuarioData.contraseña;
      }
      if (usuarioData.rol && usuarioData.rol.trim()) {
        dataToSend.rol = usuarioData.rol;
      }
      if (usuarioData.email_verificado && usuarioData.email_verificado.trim()) {
        dataToSend.email_verificado = usuarioData.email_verificado;
      }
      
      // Verificar que al menos un campo se está actualizando
      if (Object.keys(dataToSend).length === 0) {
        setErrorMessage('Debes proporcionar al menos un campo para actualizar');
        setShowErrorModal(true);
        return;
      }
      
      await apiClient.put(API_ENDPOINTS.USUARIO_BY_ID(usuarioData.id), dataToSend);
      setSuccessMessage('Usuario actualizado exitosamente');
      setShowSuccessModal(true);
      setUsuarioData({ id: "", correo: "", contraseña: "", rol: "", email_verificado: "" });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      
      // Verificar si es un error de usuario no encontrado (404 o 500)
      if (error.status === 404 || error.status === 500) {
        setErrorMessage(`El usuario con ID ${usuarioData.id} no existe o ya fue eliminado.`);
      } else if (error.status === 403) {
        // Error de permisos (super_admin requerido para email_verificado, o intentando modificar otro admin)
        setErrorMessage(error.message || 'No tienes permisos para realizar esta acción. Solo super_admin puede modificar email_verificado o modificar otros administradores.');
      } else if (error.message && error.message.toLowerCase().includes('fetch')) {
        // Error de red o CORS
        setErrorMessage(`No se pudo conectar con el servidor. Verifica que el usuario con ID ${usuarioData.id} exista.`);
      } else {
        setErrorMessage(error.message || 'Error desconocido al actualizar el usuario');
      }
      setShowErrorModal(true);
    }
  };

  const handleEliminarUsuario = async (e) => {
    e.preventDefault();
    if (!deleteUsuarioId) {
      setErrorMessage('Por favor ingresa el ID del usuario');
      setShowErrorModal(true);
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmarEliminarUsuario = async () => {
    try {
      await apiClient.delete(API_ENDPOINTS.USUARIO_BY_ID(deleteUsuarioId));
      setShowDeleteModal(false);
      setSuccessMessage('Usuario eliminado exitosamente');
      setShowSuccessModal(true);
      setDeleteUsuarioId("");
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setShowDeleteModal(false);
      
      // Verificar si es un error de usuario no encontrado (404 o 500)
      if (error.status === 404 || error.status === 500) {
        setErrorMessage(`El usuario con ID ${deleteUsuarioId} no existe o ya fue eliminado.`);
      } else if (error.message && error.message.toLowerCase().includes('fetch')) {
        // Error de red o CORS
        setErrorMessage(`No se pudo conectar con el servidor. Verifica que el usuario con ID ${deleteUsuarioId} exista.`);
      } else {
        setErrorMessage(error.message || 'Error desconocido al eliminar el usuario');
      }
      setShowErrorModal(true);
    }
  };

  // Ver productos del pedido
  const handleVerMas = async (id_pedido) => {
    if (verMasId === id_pedido) {
      setVerMasId(null);
      return;
    }
    // Si ya tenemos los detalles, solo mostrar
    if (detallesPedido[id_pedido]) {
      setVerMasId(id_pedido);
      return;
    }
    // Obtener productos del pedido usando el endpoint correcto
    try {
      const productos = await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_PEDIDO(id_pedido));
      
      setDetallesPedido(prev => ({
        ...prev,
        [id_pedido]: Array.isArray(productos) ? productos : []
      }));
      setVerMasId(id_pedido);
    } catch (error) {
      console.error('Error al cargar los productos del pedido:', error);
      setDetallesPedido(prev => ({
        ...prev,
        [id_pedido]: []
      }));
    }
  };

  return (
    <div className="admin-cuenta-container">
      <h2>Panel de administrador</h2>
      <button onClick={handleLogout} style={{float: 'right', marginTop: '-2.5rem', marginBottom: '1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer'}}>Cerrar sesión</button>
      <div className="admin-tabs">
        <button onClick={() => setTab("productos")} className={tab === "productos" ? "active" : ""}>Productos</button>
        <button onClick={() => setTab("categorias")} className={tab === "categorias" ? "active" : ""}>Categorías</button>
        <button onClick={() => setTab("pedidos")} className={tab === "pedidos" ? "active" : ""}>Pedidos</button>
        <button onClick={() => setTab("usuarios")} className={tab === "usuarios" ? "active" : ""}>Usuarios</button>
        <button onClick={() => setTab("clientes")} className={tab === "clientes" ? "active" : ""}>Clientes</button>
      </div>

      {/* CRUD Productos */}
      {tab === "productos" && (
        <div>
          <h3>Productos</h3>
          <div className="admin-filtros-productos">
            <select
              value={filtroCategoria}
              onChange={e => setFiltroCategoria(e.target.value)}
              style={{padding: "0.5rem", borderRadius: "6px", border: "1.5px solid #6C3483"}}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={e => setFiltroNombre(e.target.value)}
              style={{padding: "0.5rem", borderRadius: "6px", border: "1.5px solid #6C3483", flex: "1 1 200px"}}
            />
          </div>
          <form onSubmit={handleCrearProducto} className="admin-form">
            <input 
              value={nuevoProducto.nombre} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} 
              placeholder="Nombre" 
              required 
            />
            <input 
              value={nuevoProducto.descripcion} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} 
              placeholder="Descripción" 
              required 
            />
            <input 
              type="number" 
              value={nuevoProducto.cantidad} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, cantidad: Number(e.target.value) })} 
              placeholder="Cantidad" 
              required 
            />
            <input 
              type="number" 
              value={nuevoProducto.precio} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })} 
              placeholder="Precio" 
              required 
            />
            <select 
              value={nuevoProducto.id_categoria} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, id_categoria: Number(e.target.value) })} 
              required
            >
              <option value="">Categoría</option>
              {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
            </select>
            <select 
              value={nuevoProducto.estado} 
              onChange={e => setNuevoProducto({ ...nuevoProducto, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </label>
              {selectedFile && (
                <span className="file-name">{selectedFile.name}</span>
              )}
            </div>
            <button type="submit" disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Crear producto'}
            </button>
          </form>
          <ul>
            {productos
              .filter(prod =>
                (!filtroCategoria || prod.id_categoria === Number(filtroCategoria)) &&
                (!filtroNombre || prod.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
              )
              .map(prod => (
                <li key={prod.id_producto} className="admin-producto-item">
                  <div className="admin-producto-info">
                    {editandoProducto === prod.id_producto ? (
                      <>
                        <input value={productoEdit.nombre} onChange={e => setProductoEdit({ ...productoEdit, nombre: e.target.value })} />
                        <input value={productoEdit.descripcion} onChange={e => setProductoEdit({ ...productoEdit, descripcion: e.target.value })} />
                        <input type="number" value={productoEdit.precio} onChange={e => setProductoEdit({ ...productoEdit, precio: Number(e.target.value) })} />
                        <input type="number" value={productoEdit.cantidad} onChange={e => setProductoEdit({ ...productoEdit, cantidad: Number(e.target.value) })} />
                        <div className="image-upload-container">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id={`image-upload-${prod.id_producto}`}
                          />
                          <label htmlFor={`image-upload-${prod.id_producto}`} className="upload-button">
                            {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                          </label>
                          {selectedFile && (
                            <span className="file-name">{selectedFile.name}</span>
                          )}
                        </div>
                        <select value={productoEdit.id_categoria} onChange={e => setProductoEdit({ ...productoEdit, id_categoria: Number(e.target.value) })}>
                          <option value="">Categoría</option>
                          {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                        </select>
                        <select value={productoEdit.estado || "activo"} onChange={e => setProductoEdit({ ...productoEdit, estado: e.target.value })}>
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                        <button className="admin-btn-morado" onClick={() => handleActualizarProducto(prod.id_producto)} disabled={uploading}>
                          {uploading ? 'Subiendo...' : 'Guardar'}
                        </button>
                        <button className="admin-btn-morado" onClick={() => handleEliminarProducto(prod.id_producto)} style={{marginLeft: '0.7rem'}}>Eliminar</button>
                        <button onClick={() => setEditandoProducto(null)} style={{marginLeft: '0.7rem'}}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <div className="admin-producto-nombre"><b>{prod.nombre}</b></div>
                        <div className="admin-producto-desc">{prod.descripcion}</div>
                        <div className="admin-producto-precio">${prod.precio}</div>
                        <div className="admin-producto-stock">Stock: {prod.cantidad}</div>
                        <button className="admin-btn-morado" onClick={() => handleEditarClick(prod)}>Actualizar</button>
                      </>
                    )}
                  </div>
                  {prod.imagen_url && (
                    <div className="admin-producto-img">
                      <img 
                        src={`${prod.imagen_url}?t=${new Date().getTime()}`} 
                        alt={prod.nombre} 
                        style={{maxWidth: '120px', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover'}}
                      />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* CRUD Categorías */}
      {tab === "categorias" && (
        <div>
          <h3>Categorías</h3>
          <form onSubmit={handleCrearCategoria} className="admin-form">
            <input value={nuevaCategoria.nombre} onChange={e => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })} placeholder="Nombre" required />
            <input value={nuevaCategoria.descripcion_corta} onChange={e => setNuevaCategoria({ ...nuevaCategoria, descripcion_corta: e.target.value })} placeholder="Descripción corta" required />
            <input value={nuevaCategoria.descripcion_larga} onChange={e => setNuevaCategoria({ ...nuevaCategoria, descripcion_larga: e.target.value })} placeholder="Descripción larga" />
            <select value={nuevaCategoria.estado} onChange={e => setNuevaCategoria({ ...nuevaCategoria, estado: e.target.value })}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <button type="submit">Crear categoría</button>
          </form>
          <ul>
            {categorias.map(cat => (
              <li key={cat.id_categoria} className="admin-categoria-item">
                {editandoCategoria === cat.id_categoria ? (
                  <div className="admin-categoria-info">
                    <input value={categoriaEdit.nombre} onChange={e => setCategoriaEdit({ ...categoriaEdit, nombre: e.target.value })} placeholder="Nombre" />
                    <input value={categoriaEdit.descripcion_corta} onChange={e => setCategoriaEdit({ ...categoriaEdit, descripcion_corta: e.target.value })} placeholder="Descripción corta" />
                    <input value={categoriaEdit.descripcion_larga} onChange={e => setCategoriaEdit({ ...categoriaEdit, descripcion_larga: e.target.value })} placeholder="Descripción larga" />
                    <select value={categoriaEdit.estado || "activo"} onChange={e => setCategoriaEdit({ ...categoriaEdit, estado: e.target.value })}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <div className="admin-categoria-botones">
                      <button className="admin-btn-morado" onClick={() => handleActualizarCategoria(cat.id_categoria)}>Guardar</button>
                      <button className="admin-btn-morado" onClick={() => handleEliminarCategoria(cat.id_categoria)}>Eliminar</button>
                      <button onClick={() => setEditandoCategoria(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-categoria-info">
                    <div className="admin-categoria-nombre"><b>{cat.nombre}</b></div>
                    <div className="admin-categoria-desc">{cat.descripcion_corta}</div>
                    <div className="admin-categoria-botones">
                      <button className="admin-btn-morado" onClick={() => handleEditarCategoriaClick(cat)}>Actualizar</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gestión de Pedidos */}
      {tab === "pedidos" && (
        <div>
          <h3>Pedidos</h3>
          <label>Filtrar por estado: </label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <ul>
            {Array.isArray(pedidos) && pedidos.map(pedido => (
              <li key={pedido.id_pedido} style={{marginBottom: '1.5rem'}}>
                <b>Pedido #{pedido.id_pedido}</b> - Estado: {pedido.estado}
                <button className="admin-btn-morado" style={{marginLeft: '1rem'}} onClick={() => setEditandoEstadoId(editandoEstadoId === pedido.id_pedido ? null : pedido.id_pedido)}>Actualizar</button>
                <button className="admin-btn-morado" style={{marginLeft: '0.7rem'}} onClick={() => handleVerMas(pedido.id_pedido)}>
                  {verMasId === pedido.id_pedido ? "Ocultar" : "Ver más"}
                </button>
                <span> | Cliente: {pedido.id_cliente} | Dirección: {pedido.direccion_envio} | Fecha: {pedido.fecha_pedido}</span>
                {editandoEstadoId === pedido.id_pedido && (
                  <div style={{marginTop: '0.7rem'}}>
                    <select value={pedido.estado} onChange={e => handleActualizarEstado(pedido.id_pedido, e.target.value)}>
                      {ESTADOS.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    <button style={{marginLeft: '0.7rem'}} onClick={() => setEditandoEstadoId(null)}>Cerrar</button>
                  </div>
                )}
                {verMasId === pedido.id_pedido && detallesPedido[pedido.id_pedido] && (
                  <div style={{marginTop: '1rem', background: '#f3e5f5', borderRadius: '8px', padding: '1rem'}}>
                    <b>Productos del pedido:</b>
                    <ul style={{marginTop: '0.7rem'}}>
                      {detallesPedido[pedido.id_pedido].map((det, idx) => (
                        <li key={det.id_detalle} style={{marginBottom: '0.5rem'}}>
                          <b>{det.producto?.nombre}</b> - {det.producto?.descripcion}<br/>
                          Valor unitario: ${det.producto?.precio} | Cantidad: {det.cantidad} | Subtotal: ${det.subtotal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gestión de Usuarios */}
      {tab === "usuarios" && (
        <div>
          <h3>Gestión de Usuarios</h3>
          <p style={{color: '#666', marginBottom: '1.5rem'}}>Solo administradores pueden listar, actualizar o eliminar usuarios.</p>
          
          {/* Sección para listar todos los usuarios */}
          <div style={{marginBottom: '3rem', padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px'}}>
            <h4>Lista de Usuarios</h4>
            <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
              <select
                value={filtroRol}
                onChange={e => setFiltroRol(e.target.value)}
                style={{padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #6C3483', flex: '1 1 150px'}}
              >
                <option value="">Todos los roles</option>
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <select
                value={filtroEmailVerificado}
                onChange={e => setFiltroEmailVerificado(e.target.value)}
                style={{padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #6C3483', flex: '1 1 150px'}}
              >
                <option value="">Todos (verificados/no)</option>
                <option value="S">Verificados</option>
                <option value="N">No verificados</option>
              </select>
              <input
                type="text"
                placeholder="Buscar por correo..."
                value={filtroCorreo}
                onChange={e => setFiltroCorreo(e.target.value)}
                style={{padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #6C3483', flex: '2 1 200px'}}
              />
              <button
                onClick={handleCargarUsuarios}
                disabled={loadingUsuarios}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: loadingUsuarios ? 'not-allowed' : 'pointer',
                  opacity: loadingUsuarios ? 0.7 : 1,
                }}
              >
                {loadingUsuarios ? 'Cargando...' : 'Buscar'}
              </button>
            </div>
            
            {usuarios.length > 0 && (
              <div style={{overflowX: 'auto', marginTop: '1rem'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                  <thead>
                    <tr style={{background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)', color: 'white'}}>
                      <th style={{padding: '0.8rem', textAlign: 'left'}}>ID</th>
                      <th style={{padding: '0.8rem', textAlign: 'left'}}>Correo</th>
                      <th style={{padding: '0.8rem', textAlign: 'left'}}>Rol</th>
                      <th style={{padding: '0.8rem', textAlign: 'center'}}>Email Verificado</th>
                      <th style={{padding: '0.8rem', textAlign: 'left'}}>Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario, index) => (
                      <tr key={usuario.id_usuario} style={{borderBottom: '1px solid #f0f0f0', background: index % 2 === 0 ? '#fafafa' : 'white'}}>
                        <td style={{padding: '0.8rem'}}>{usuario.id_usuario}</td>
                        <td style={{padding: '0.8rem'}}>{usuario.correo}</td>
                        <td style={{padding: '0.8rem'}}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            background: usuario.rol === 'super_admin' ? '#ff9800' : usuario.rol === 'admin' ? '#2196f3' : '#4caf50',
                            color: 'white'
                          }}>
                            {usuario.rol}
                          </span>
                        </td>
                        <td style={{padding: '0.8rem', textAlign: 'center'}}>
                          <span style={{
                            fontSize: '1.5rem'
                          }}>
                            {usuario.email_verificado === 'S' ? '✅' : '❌'}
                          </span>
                        </td>
                        <td style={{padding: '0.8rem'}}>
                          {usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleString('es-ES') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
                  <button
                    onClick={() => setPaginacion(prev => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))}
                    disabled={paginacion.skip === 0}
                    style={{
                      padding: '0.5rem 1rem',
                      background: paginacion.skip === 0 ? '#ccc' : '#6C3483',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: paginacion.skip === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Anterior
                  </button>
                  <span>Mostrando desde {paginacion.skip + 1} (límite: {paginacion.limit})</span>
                  <button
                    onClick={() => setPaginacion(prev => ({ ...prev, skip: prev.skip + prev.limit }))}
                    disabled={usuarios.length < paginacion.limit}
                    style={{
                      padding: '0.5rem 1rem',
                      background: usuarios.length < paginacion.limit ? '#ccc' : '#6C3483',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: usuarios.length < paginacion.limit ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
            {usuarios.length === 0 && !loadingUsuarios && (
              <p style={{textAlign: 'center', color: '#666', marginTop: '1rem'}}>No hay usuarios para mostrar. Haz clic en "Buscar" para cargar la lista.</p>
            )}
          </div>
          
          <div style={{marginBottom: '3rem', padding: '1.5rem', background: '#f3e5f5', borderRadius: '8px'}}>
            <h4>Mi Información (Usuario Actual)</h4>
            <button 
              onClick={handleObtenerUsuarioActual} 
              disabled={loadingUsuarioActual}
              style={{
                padding: '0.7rem 1.5rem',
                background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: loadingUsuarioActual ? 'not-allowed' : 'pointer',
                opacity: loadingUsuarioActual ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
              }}
              onMouseOver={(e) => {
                if (!loadingUsuarioActual) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(139, 95, 191, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 95, 191, 0.2)';
              }}
            >
              {loadingUsuarioActual ? 'Cargando...' : 'Obtener mi información'}
            </button>
            {usuarioActual && (
              <div style={{marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '6px'}}>
                <p><strong>ID Usuario:</strong> {usuarioActual.id_usuario}</p>
                <p><strong>Correo:</strong> {usuarioActual.sub}</p>
                <p><strong>Rol:</strong> {usuarioActual.rol}</p>
              </div>
            )}
          </div>

          <div style={{marginBottom: '3rem'}}>
            <h4>Actualizar Usuario</h4>
            <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1rem'}}>
              Todos los campos son opcionales excepto el ID. Solo se actualizarán los campos que completes.
            </p>
            <form onSubmit={handleActualizarUsuario} className="admin-form">
              <input 
                type="text"
                value={usuarioData.id} 
                onChange={e => setUsuarioData({ ...usuarioData, id: e.target.value })} 
                placeholder="ID del usuario (requerido)" 
                required 
              />
              <input 
                type="email"
                value={usuarioData.correo} 
                onChange={e => setUsuarioData({ ...usuarioData, correo: e.target.value })} 
                placeholder="Correo electrónico (opcional)" 
              />
              <input 
                type="password"
                value={usuarioData.contraseña} 
                onChange={e => setUsuarioData({ ...usuarioData, contraseña: e.target.value })} 
                placeholder="Nueva contraseña (opcional, mín 8 caracteres)" 
              />
              <select 
                value={usuarioData.rol} 
                onChange={e => setUsuarioData({ ...usuarioData, rol: e.target.value })}
              >
                <option value="">-- Sin cambios en rol --</option>
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <select 
                value={usuarioData.email_verificado} 
                onChange={e => setUsuarioData({ ...usuarioData, email_verificado: e.target.value })}
              >
                <option value="">-- Sin cambios en verificación --</option>
                <option value="S">Email Verificado (S)</option>
                <option value="N">Email No Verificado (N)</option>
              </select>
              <div style={{background: '#fff3cd', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#856404', marginTop: '0.5rem'}}>
                <strong>⚠️ Nota:</strong> Solo super_admin puede modificar el campo "email_verificado". 
                Admins solo pueden modificar clientes o su propia cuenta.
              </div>
              <button type="submit" className="admin-btn-morado">Actualizar Usuario</button>
            </form>
          </div>

          <div>
            <h4>Eliminar Usuario</h4>
            <form onSubmit={handleEliminarUsuario} className="admin-form">
              <input 
                type="text"
                value={deleteUsuarioId} 
                onChange={e => setDeleteUsuarioId(e.target.value)} 
                placeholder="ID del usuario a eliminar" 
                required 
              />
              <button type="submit" style={{background: '#d32f2f'}}>Eliminar Usuario</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Gestión de Clientes */}
      {tab === "clientes" && (
        <div>
          <h3>Gestión de Clientes</h3>
          <p style={{color: '#666', marginBottom: '1.5rem'}}>Administra los perfiles de clientes de la tienda.</p>
          
          <div style={{marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <button 
              onClick={handleCargarClientes}
              disabled={loadingClientes}
              style={{
                padding: '0.7rem 1.5rem',
                background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: loadingClientes ? 'not-allowed' : 'pointer',
                opacity: loadingClientes ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
              }}
            >
              {loadingClientes ? 'Cargando...' : 'Cargar lista de clientes'}
            </button>
            
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              value={busquedaCliente}
              onChange={e => setBusquedaCliente(e.target.value)}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {clientes.length > 0 ? (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)', color: 'white'}}>
                    <th style={{padding: '1rem', textAlign: 'left'}}>ID</th>
                    <th style={{padding: '1rem', textAlign: 'left'}}>Nombre Completo</th>
                    <th style={{padding: '1rem', textAlign: 'left'}}>Correo</th>
                    <th style={{padding: '1rem', textAlign: 'left'}}>Teléfono</th>
                    <th style={{padding: '1rem', textAlign: 'left'}}>Dirección</th>
                    <th style={{padding: '1rem', textAlign: 'center'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes
                    .filter(cliente => {
                      if (!busquedaCliente) return true;
                      const busqueda = busquedaCliente.toLowerCase();
                      return (
                        cliente.nombre?.toLowerCase().includes(busqueda) ||
                        cliente.apellido?.toLowerCase().includes(busqueda) ||
                        cliente.usuario?.correo?.toLowerCase().includes(busqueda)
                      );
                    })
                    .map((cliente, index) => (
                      <tr key={cliente.id_cliente} style={{borderBottom: '1px solid #f0f0f0', background: index % 2 === 0 ? '#fafafa' : 'white'}}>
                        <td style={{padding: '1rem'}}>{cliente.id_cliente}</td>
                        <td style={{padding: '1rem'}}>
                          <strong>{cliente.nombre} {cliente.apellido}</strong>
                        </td>
                        <td style={{padding: '1rem'}}>{cliente.usuario?.correo || 'N/A'}</td>
                        <td style={{padding: '1rem'}}>{cliente.telefono || 'N/A'}</td>
                        <td style={{padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {cliente.direccion || 'N/A'}
                        </td>
                        <td style={{padding: '1rem', textAlign: 'center'}}>
                          <button
                            onClick={() => handleVerDetallesCliente(cliente.id_cliente)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              marginRight: '0.5rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            Ver detalles
                          </button>
                          <button
                            onClick={() => {
                              setDeleteClienteId(cliente.id_cliente);
                              setShowDeleteClienteModal(true);
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
                <button
                  onClick={() => setPaginacionClientes(prev => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))}
                  disabled={paginacionClientes.skip === 0}
                  style={{
                    padding: '0.5rem 1rem',
                    background: paginacionClientes.skip === 0 ? '#ccc' : '#6C3483',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: paginacionClientes.skip === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <span>Mostrando desde {paginacionClientes.skip + 1} (límite: {paginacionClientes.limit})</span>
                <button
                  onClick={() => setPaginacionClientes(prev => ({ ...prev, skip: prev.skip + prev.limit }))}
                  disabled={clientes.length < paginacionClientes.limit}
                  style={{
                    padding: '0.5rem 1rem',
                    background: clientes.length < paginacionClientes.limit ? '#ccc' : '#6C3483',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: clientes.length < paginacionClientes.limit ? 'not-allowed' : 'pointer'
                  }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
              <p>No hay clientes cargados. Haz clic en "Cargar lista de clientes" para ver todos los clientes.</p>
            </div>
          )}

          {clienteSeleccionado && (
            <div style={{marginTop: '2rem', padding: '1.5rem', background: '#f3e5f5', borderRadius: '8px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h4>Detalles del Cliente</h4>
                <button
                  onClick={() => setClienteSeleccionado(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
              <div style={{background: 'white', padding: '1rem', borderRadius: '6px'}}>
                <p><strong>ID Cliente:</strong> {clienteSeleccionado.id_cliente}</p>
                <p><strong>ID Usuario:</strong> {clienteSeleccionado.usuario?.id_usuario || clienteSeleccionado.id_usuario || 'N/A'}</p>
                <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
                <p><strong>Apellido:</strong> {clienteSeleccionado.apellido}</p>
                <p><strong>Correo:</strong> {clienteSeleccionado.usuario?.correo || 'N/A'}</p>
                <p><strong>Rol:</strong> {clienteSeleccionado.usuario?.rol || 'N/A'}</p>
                <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono || 'No especificado'}</p>
                <p><strong>Dirección:</strong> {clienteSeleccionado.direccion || 'No especificada'}</p>
                <p><strong>Fecha de registro:</strong> {clienteSeleccionado.fecha_registro ? new Date(clienteSeleccionado.fecha_registro).toLocaleString('es-ES') : 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de confirmación para eliminar cliente */}
      {showDeleteClienteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{color: '#d32f2f', marginBottom: '1rem'}}>⚠️ Confirmar eliminación de cliente</h3>
            <p style={{marginBottom: '1rem', lineHeight: '1.6'}}>
              ¿Estás seguro de que deseas eliminar el perfil del cliente con ID <strong>{deleteClienteId}</strong>?
            </p>
            <div style={{background: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffc107'}}>
              <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>Esto eliminará:</strong></p>
              <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.95rem'}}>
                <li>El perfil del cliente (nombre, teléfono, dirección)</li>
                <li>Posiblemente sus pedidos y carritos asociados</li>
              </ul>
              <p style={{margin: '0.5rem 0', fontSize: '0.95rem', color: '#d32f2f'}}>
                <strong>Nota:</strong> El usuario aún podrá iniciar sesión y crear un nuevo perfil.
              </p>
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button 
                onClick={() => setShowDeleteClienteModal(false)}
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleEliminarCliente}
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Sí, eliminar cliente
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar usuario */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{color: '#d32f2f', marginBottom: '1rem'}}>⚠️ Advertencia: Acción Irreversible</h3>
            <p style={{marginBottom: '1rem', lineHeight: '1.6'}}>
              Estás a punto de <strong>eliminar permanentemente</strong> el usuario con ID <strong>{deleteUsuarioId}</strong>.
            </p>
            <div style={{background: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffc107'}}>
              <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>Esto eliminará:</strong></p>
              <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.95rem'}}>
                <li>La cuenta del usuario</li>
                <li>Su perfil de cliente (si existe)</li>
                <li>Posiblemente sus pedidos y carritos</li>
              </ul>
              <p style={{margin: '0.5rem 0', fontSize: '0.95rem', color: '#d32f2f'}}>
                <strong>El usuario tendrá que registrarse nuevamente para volver a acceder.</strong>
              </p>
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminarUsuario}
                style={{
                  padding: '0.7rem 1.5rem',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Sí, eliminar usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>❌</div>
            <h3 style={{color: '#d32f2f', marginBottom: '1rem'}}>Error</h3>
            <p style={{marginBottom: '1.5rem', lineHeight: '1.6', color: '#666'}}>
              {errorMessage}
            </p>
            <button 
              onClick={() => setShowErrorModal(false)}
              style={{
                padding: '0.7rem 2rem',
                background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✅</div>
            <h3 style={{color: '#06a37c', marginBottom: '1rem'}}>Éxito</h3>
            <p style={{marginBottom: '1.5rem', lineHeight: '1.6', color: '#666'}}>
              {successMessage}
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{
                padding: '0.7rem 2rem',
                background: 'linear-gradient(45deg, #8B5FBF, #FF9AA2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCuenta;
