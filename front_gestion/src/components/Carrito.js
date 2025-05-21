import React, { useEffect, useState, useRef } from "react";
import "../styles/Carrito.css";
import { useNavigate } from "react-router-dom";

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
    fetch(`https://backrosaline-production.up.railway.app/clientes/usuario/${usuario.id}`)
      .then(res => res.json())
      .then(setCliente);
  }, [usuario]);

  // Obtener carrito cuando cambia el cliente
  useEffect(() => {
    if (!cliente) return;
    fetch(`https://backrosaline-production.up.railway.app/clientes/${cliente.id_cliente}/carritos`)
      .then(res => res.json())
      .then(carritos => {
        const carritoActivo = carritos.find(c => c.estado === "activo");
        setCarrito(carritoActivo);
      });
  }, [cliente]);

  // Obtener detalles cuando cambia el carrito
  useEffect(() => {
    if (!carrito) return;
    fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/`)
      .then(res => res.json())
      .then(detallesAll => {
        const detallesCarrito = detallesAll.filter(d => d.id_carrito === carrito.id_carrito);
        setDetalles(detallesCarrito);
      });
  }, [carrito]);

  // Obtener productos cuando cambian los detalles
  useEffect(() => {
    if (detalles.length === 0) {
      setProductos([]);
      return;
    }
    fetch(`https://backrosaline-production.up.railway.app/productos/`)
      .then(res => res.json())
      .then(productosAll => {
        const productosSeleccionados = detalles.map(d => productosAll.find(p => p.id_producto === d.id_producto));
        setProductos(productosSeleccionados);
      });
  }, [detalles]);

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
        await actions.order.capture();
        // 1. Crear el pedido en el backend
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const clienteRes = await fetch(`https://backrosaline-production.up.railway.app/clientes/usuario/${usuario.id}`);
        const cliente = await clienteRes.json();
        const pedidoRes = await fetch("https://backrosaline-production.up.railway.app/pedidos/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_cliente: cliente.id_cliente,
            estado: "Pago confirmado",
            direccion_envio: cliente.direccion,
            metodo_pago: "PayPal"
          })
        });
        const pedido = await pedidoRes.json();
        // 2. Crear los detalles de pedido
        for (let i = 0; i < detalles.length; i++) {
          await fetch("https://backrosaline-production.up.railway.app/detalle_pedidos/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_pedido: pedido.id_pedido,
              id_producto: detalles[i].id_producto,
              cantidad: detalles[i].cantidad,
              precio_unitario: productos[i].precio
            })
          });
        }
        // 2.5 Eliminar los detalles del carrito (vaciar carrito)
        for (let i = 0; i < detalles.length; i++) {
            await fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/${detalles[i].id_detalle_carrito}`, {
            method: "DELETE"
          });
        }
        // 3. Redirigir a la vista de confirmación
        navigate(`/pedido-confirmado/${pedido.id_pedido}`);
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
      const res = await fetch(`https://backrosaline-production.up.railway.app/detalle_carrito/${id_detalle}`, { method: "DELETE" });
      if (!res.ok) {
        alert("No se pudo eliminar el producto del carrito.");
        return;
      }
      // Recargar la página para actualizar el carrito visualmente
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  };

  if (!usuario) return <div className="carrito-container">Debes iniciar sesión para ver tu carrito.</div>;
  if (!carrito) return <div className="carrito-container">Cargando carrito...</div>;
  if (detalles.length === 0) return <div className="carrito-container">Tu carrito está vacío.</div>;

  return (
    <div className="carrito-container">
      <h2>Mi carrito</h2>
      <ul className="carrito-lista">
        {detalles.map((detalle, i) => (
          <li key={detalle.id_detalle_carrito} className="carrito-item">
            <div className="carrito-img">
              {productos[i]?.imagen_url ? (
                <img src={productos[i].imagen_url} alt={productos[i].nombre} />
              ) : (
                <div className="carrito-img-placeholder">Imagen</div>
              )}
            </div>
            <div className="carrito-info">
              <div className="carrito-nombre">{productos[i]?.nombre}</div>
              <div className="carrito-precio">${productos[i]?.precio}</div>
              <div className="carrito-cantidad">
                <label>Cantidad: </label>
                <span>{detalle.cantidad}</span>
              </div>
              <div className="carrito-subtotal">
                Subtotal: ${productos[i] ? productos[i].precio * detalle.cantidad : 0}
              </div>
              <button className="carrito-btn-eliminar" onClick={() => handleEliminar(detalle.id_detalle_carrito)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="carrito-total">
        <b>Total a pagar: ${total}</b>
      </div>
      {/* Botón de PayPal */}
      {detalles.length > 0 && <div ref={paypalRef}></div>}
    </div>
  );
}

export default Carrito;
