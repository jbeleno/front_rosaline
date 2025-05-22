import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/VistaProducto.css";

function VistaProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    fetch(`https://backrosaline-production.up.railway.app/productos/`)
      .then(res => res.json())
      .then(data => {
        const prod = data.find(p => p.id_producto === parseInt(id));
        console.log('Producto encontrado:', prod); // Debug log
        if (prod && prod.imagen_url) {
          // Asegurarse de que la URL de la imagen sea accesible
          if (!prod.imagen_url.startsWith('http')) {
            // Si es una ruta relativa, agregar la URL base del backend
            prod.imagen_url = `https://backrosaline-production.up.railway.app${prod.imagen_url.startsWith('/') ? '' : '/'}${prod.imagen_url}`;
          }
          console.log('URL de la imagen procesada:', prod.imagen_url); // Debug log
        }
        setProducto(prod);
      })
      .catch(error => console.error('Error al cargar el producto:', error));
  }, [id]);

  const handleAddToCart = async (goToCart = false) => {
    try {
      if (!usuario) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        navigate("/login");
        return;
      }
      // 1. Obtener cliente
      const clienteRes = await fetch(`https://backrosaline-production.up.railway.app/clientes/usuario/${usuario.id}`);
      if (!clienteRes.ok) throw new Error("Error obteniendo cliente");
      const cliente = await clienteRes.json();
      // 2. Obtener carrito activo
      const carritosRes = await fetch(`https://backrosaline-production.up.railway.app/clientes/${cliente.id_cliente}/carritos`);
      if (!carritosRes.ok) throw new Error("Error obteniendo carritos");
      const carritos = await carritosRes.json();
      let carrito = carritos.find(c => c.estado === "activo");
      // 3. Si no hay carrito activo, crearlo
      if (!carrito) {
        const bodyCarrito = { id_cliente: cliente.id_cliente, estado: "activo" };
        console.log("Creando carrito con:", bodyCarrito);
        const nuevoCarritoRes = await fetch(`https://backrosaline-production.up.railway.app/carritos/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyCarrito)
        });
        if (!nuevoCarritoRes.ok) throw new Error("Error creando carrito");
        carrito = await nuevoCarritoRes.json();
      }
      // 4. Buscar si ya existe el producto en el carrito
      const detallesRes = await fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/`);
      if (!detallesRes.ok) throw new Error("Error obteniendo detalles de carrito");
      const detalles = await detallesRes.json();
      const detalleExistente = detalles.find(d => d.id_carrito === carrito.id_carrito && d.id_producto === producto.id_producto);
      if (detalleExistente) {
        // Actualizar cantidad
        const nuevaCantidad = detalleExistente.cantidad + Number(cantidad);
        const bodyDetalle = {
          id_carrito: carrito.id_carrito,
          id_producto: producto.id_producto,
          cantidad: nuevaCantidad,
          precio_unitario: producto.precio,
          subtotal: nuevaCantidad * producto.precio
        };
        console.log("Actualizando detalle_carrito con:", bodyDetalle);
        const res = await fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/${detalleExistente.id_detalle_carrito}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyDetalle)
        });
        if (!res.ok) throw new Error("Error actualizando detalle del carrito");
      } else {
        // Crear nuevo detalle
        const bodyDetalle = {
          id_carrito: carrito.id_carrito,
          id_producto: producto.id_producto,
          cantidad: Number(cantidad),
          precio_unitario: producto.precio,
          subtotal: Number(cantidad) * producto.precio
        };
        console.log("Creando detalle_carrito con:", bodyDetalle);
        const res = await fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyDetalle)
        });
        if (!res.ok) throw new Error("Error agregando producto al carrito");
      }
      if (goToCart) navigate("/carrito");
      else alert("Producto añadido al carrito");
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      alert("Ocurrió un error al agregar el producto al carrito. Intenta de nuevo.");
    }
  };

  if (!producto) return <div className="vista-producto-container">Cargando...</div>;

  return (
    <div className="vista-producto-container">
      <div className="vista-producto-img">
        {producto.imagen_url ? (
          <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: '10px'
              }}
              onError={(e) => {
                console.error('Error al cargar la imagen:', producto.imagen_url);
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
        <h1>{producto.nombre}</h1>
        <p className="vista-producto-desc">{producto.descripcion}</p>
        <p className="vista-producto-precio">${producto.precio}</p>
        {producto.cantidad > 0 ? (
          <>
            <div className="vista-producto-cantidad">
              <label>Cantidad: </label>
              <input
                type="number"
                min="1"
                max={producto.cantidad}
                value={cantidad}
                onChange={e => {
                  const val = Math.max(1, Math.min(producto.cantidad, Number(e.target.value)));
                  setCantidad(val);
                }}
              />
            </div>
            <div className="vista-producto-botones">
              <button className="vista-producto-btn comprar" onClick={() => handleAddToCart(true)}>Comprar</button>
              <button className="vista-producto-btn carrito" onClick={() => handleAddToCart(false)}>Agregar al carrito</button>
            </div>
          </>
        ) : (
          <div className="vista-producto-agotado">Agotado</div>
        )}
      </div>
    </div>
  );
}

export default VistaProducto;
