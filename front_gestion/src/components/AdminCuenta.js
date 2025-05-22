import React, { useState, useEffect } from "react";
import "../styles/AdminCuenta.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

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
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", descripcion: "", cantidad: 0, precio: 0, id_categoria: "", imagen_url: "" });
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [productoEdit, setProductoEdit] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // Categorías
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion_corta: "", descripcion_larga: "" });
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState({});

  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [verMasId, setVerMasId] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState({});
  const [editandoEstadoId, setEditandoEstadoId] = useState(null);

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetch("https://backrosaline-production.up.railway.app/productos/").then(res => res.json()).then(setProductos);
    fetch("https://backrosaline-production.up.railway.app/categorias/").then(res => res.json()).then(setCategorias);
    fetch("https://backrosaline-production.up.railway.app/pedidos/").then(res => res.json()).then(setPedidos);
  }, []);

  // Filtrar pedidos por estado
  useEffect(() => {
    if (filtroEstado) {
      fetch(`https://backrosaline-production.up.railway.app/pedidos/estado/${filtroEstado}`).then(res => res.json()).then(setPedidos);
    } else {
      fetch("https://backrosaline-production.up.railway.app/pedidos/").then(res => res.json()).then(setPedidos);
    }
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
    
    // 1. Crear el producto primero para obtener el id
    const res = await fetch("https://backrosaline-production.up.railway.app/productos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevoProducto, imagen_url: "" })
    });

    if (res.ok) {
      const prod = await res.json();
      
      // 2. Si hay archivo, subirlo con el id del producto
      let imagenUrl = "";
      if (selectedFile) {
        imagenUrl = await uploadImage(selectedFile, prod.id_producto);
        if (!imagenUrl) {
          // Si falla la subida de la imagen, eliminar el producto creado
          await fetch(`https://backrosaline-production.up.railway.app/productos/${prod.id_producto}`, { method: "DELETE" });
          return;
        }
        
        // Actualizar el producto con la url de la imagen
        const updateRes = await fetch(`https://backrosaline-production.up.railway.app/productos/${prod.id_producto}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...prod, imagen_url: imagenUrl })
        });
        
        if (updateRes.ok) {
          const updatedProd = await updateRes.json();
          setProductos([...productos, updatedProd]);
        }
      } else {
        setProductos([...productos, prod]);
      }

      setNuevoProducto({ 
        nombre: "", 
        descripcion: "", 
        cantidad: 0, 
        precio: 0, 
        id_categoria: "", 
        imagen_url: "" 
      });
      setSelectedFile(null);
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

      const res = await fetch(`https://backrosaline-production.up.railway.app/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData)
      });

      if (res.ok) {
        const actualizado = await res.json();
        // Actualizar la lista de productos
        setProductos(productos.map(p => p.id_producto === id ? actualizado : p));
        setEditandoProducto(null);
        setProductoEdit({});
        setSelectedFile(null);
        
        // Recargar la lista completa de productos para asegurar que todo está actualizado
        const productosRes = await fetch("https://backrosaline-production.up.railway.app/productos/");
        if (productosRes.ok) {
          const productosActualizados = await productosRes.json();
          setProductos(productosActualizados);
        }
      } else {
        alert('Error al actualizar el producto');
      }
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
      imagen_url: prod.imagen_url
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
      const deleteRes = await fetch(`https://backrosaline-production.up.railway.app/productos/${id}`, { 
        method: "DELETE" 
      });
      
      if (!deleteRes.ok) throw new Error('Error al eliminar el producto');

      // 4. Actualizar la lista de productos
      const productosRes = await fetch("https://backrosaline-production.up.railway.app/productos/");
      if (productosRes.ok) {
        const productosActualizados = await productosRes.json();
        setProductos(productosActualizados);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto: ' + error.message);
    }
  };

  // CRUD Categorías
  const handleCrearCategoria = async e => {
    e.preventDefault();
    const res = await fetch("https://backrosaline-production.up.railway.app/categorias/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaCategoria)
    });
    if (res.ok) {
      const cat = await res.json();
      setCategorias([...categorias, cat]);
      setNuevaCategoria({ nombre: "", descripcion_corta: "", descripcion_larga: "" });
    }
  };

  const handleEliminarCategoria = async id => {
    await fetch(`https://backrosaline-production.up.railway.app/categorias/${id}`, { method: "DELETE" });
    setCategorias(categorias.filter(c => c.id_categoria !== id));
  };

  const handleEditarCategoriaClick = cat => {
    setEditandoCategoria(cat.id_categoria);
    setCategoriaEdit({
      nombre: cat.nombre,
      descripcion_corta: cat.descripcion_corta,
      descripcion_larga: cat.descripcion_larga
    });
  };

  const handleActualizarCategoria = async id => {
    const res = await fetch(`https://backrosaline-production.up.railway.app/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoriaEdit)
    });
    if (res.ok) {
      const actualizada = await res.json();
      setCategorias(categorias.map(c => c.id_categoria === id ? actualizada : c));
      setEditandoCategoria(null);
      setCategoriaEdit({});
    }
  };

  // Actualizar estado de pedido
  const handleActualizarEstado = async (id_pedido, nuevoEstado) => {
    const pedido = pedidos.find(p => p.id_pedido === id_pedido);
    if (!pedido) return;
    const res = await fetch(`https://backrosaline-production.up.railway.app/pedidos/${id_pedido}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pedido, estado: nuevoEstado })
    });
    if (res.ok) {
      setPedidos(pedidos.map(p => p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p));
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
    // Obtener detalles y productos
      try {
        const detallesRes = await fetch(`https://backrosaline-production.up.railway.app/detalle_pedidos/`);
        if (!detallesRes.ok) throw new Error('Error al cargar los detalles del pedido');
        
        const detallesAll = await detallesRes.json();
        // Ensure detallesAll is an array before calling filter
        const detalles = Array.isArray(detallesAll) 
          ? detallesAll.filter(d => d && d.id_pedido === id_pedido)
          : [];
          
        // Get products
        const productosRes = await fetch(`https://backrosaline-production.up.railway.app/pedidos/${id_pedido}/productos`);
        if (!productosRes.ok) throw new Error('Error al cargar los productos del pedido');
        
        const productos = await productosRes.json();
        
        setDetallesPedido(prev => ({
          ...prev,
          [id_pedido]: Array.isArray(productos) 
            ? detalles.map(det => ({
                ...det,
                producto: productos.find(p => p && p.id_producto === det.id_producto) || {}
              }))
            : []
        }));
      } catch (error) {
        console.error('Error al cargar los detalles del pedido:', error);
        // Set empty array on error
        setDetallesPedido(prev => ({
          ...prev,
          [id_pedido]: []
        }));
      } finally {
        setVerMasId(prevId => prevId === id_pedido ? null : id_pedido);
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
            {pedidos.map(pedido => (
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
    </div>
  );
}

export default AdminCuenta;
