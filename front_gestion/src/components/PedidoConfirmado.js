import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PedidoConfirmado.css";
import { apiClient } from '../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../shared/services/api/endpoints';

function PedidoConfirmado() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPedidoData = async () => {
      try {
        // Obtener pedido específico
        const pedidoData = await apiClient.get(API_ENDPOINTS.PEDIDO_BY_ID(id));
        setPedido(pedidoData);
        
        // Obtener productos del pedido usando el endpoint específico
        const productosData = await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_PEDIDO(id));
        setProductos(Array.isArray(productosData) ? productosData : []);
        
        // Obtener detalles del pedido para tener la cantidad
        const detallesAll = await apiClient.get(API_ENDPOINTS.DETALLE_PEDIDOS);
        const detallesPedido = detallesAll.filter(d => d.id_pedido === parseInt(id));
        setDetalles(detallesPedido);
      } catch (error) {
        console.error('Error al cargar los datos del pedido:', error);
      }
    };
    
    fetchPedidoData();
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