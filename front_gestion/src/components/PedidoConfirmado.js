import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PedidoConfirmado.css";

function PedidoConfirmado() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Obtener pedido
    fetch(`http://3.137.201.203/pedidos/`)
      .then(res => res.json())
      .then(data => {
        const p = data.find(p => p.id_pedido === parseInt(id));
        setPedido(p);
      });
    // Obtener detalles del pedido
    fetch(`http://3.137.201.203/detalle_pedidos/`)
      .then(res => res.json())
      .then(data => {
        const detallesPedido = data.filter(d => d.id_pedido === parseInt(id));
        setDetalles(detallesPedido);
      });
    // Obtener productos del pedido
    fetch(`http://3.137.201.203/pedidos/${id}/productos`)
      .then(res => res.json())
      .then(setProductos);
  }, [id]);

  useEffect(() => {
    if (detalles.length > 0 && productos.length > 0) {
      let t = 0;
      detalles.forEach((d, i) => {
        const prod = productos.find(p => p.id_producto === d.id_producto);
        if (prod) t += prod.precio * d.cantidad;
      });
      setTotal(t);
    }
  }, [detalles, productos]);

  if (!pedido) return <div className="pedido-confirmado-container">Cargando...</div>;

  return (
    <div className="pedido-confirmado-container">
      <h2 className="pedido-confirmado-titulo">¡Confirmamos tu pedido!</h2>
      <div className="pedido-confirmado-id">
        <span>ID de pedido:</span> <b>{pedido.id_pedido}</b>
      </div>
      <h3 className="pedido-confirmado-subtitulo">Productos:</h3>
      <ul className="pedido-confirmado-lista">
        {detalles.map((detalle, i) => {
          const prod = productos.find(p => p.id_producto === detalle.id_producto);
          if (!prod) return null;
          return (
            <li key={detalle.id_detalle} className="pedido-confirmado-producto">
              <div className="pedido-confirmado-producto-nombre"><b>{prod.nombre}</b></div>
              <div className="pedido-confirmado-producto-desc">{prod.descripcion}</div>
              <div className="pedido-confirmado-producto-info">
                <span>Valor unitario: <b>${prod.precio}</b></span>
                <span>Cantidad: <b>{detalle.cantidad}</b></span>
                <span>Subtotal: <b>${prod.precio * detalle.cantidad}</b></span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="pedido-confirmado-total">
        <span>Total:</span> <b>${total}</b>
      </div>
    </div>
  );
}

export default PedidoConfirmado; 