import React, { useEffect, useState } from "react";
import "../styles/ClienteCuenta.css";
import { useNavigate } from "react-router-dom";

function ClienteCuenta() {
  const [cliente, setCliente] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [productosPedido, setProductosPedido] = useState({});
  const [verMas, setVerMas] = useState(null);
  const [usuario] = useState(() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;
    fetch(`http://127.0.0.1:8000/clientes/usuario/${usuario.id}`)
      .then(res => res.json())
      .then(cli => {
        setCliente(cli);
        setForm({
          nombre: cli.nombre,
          apellido: cli.apellido,
          telefono: cli.telefono,
          direccion: cli.direccion
        });
      });
  }, [usuario]);

  useEffect(() => {
    if (!cliente) return;
    fetch(`http://127.0.0.1:8000/clientes/${cliente.id_cliente}/pedidos`)
      .then(res => res.json())
      .then(setPedidos);
  }, [cliente]);

  const handleUpdate = async e => {
    e.preventDefault();
    const res = await fetch(`http://127.0.0.1:8000/clientes/${cliente.id_cliente}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: usuario.id,
        ...form
      })
    });
    if (res.ok) {
      const updated = await res.json();
      setCliente(updated);
      setEdit(false);
      alert("Información actualizada");
    }
  };

  const handleVerMas = id_pedido => {
    if (productosPedido[id_pedido]) {
      setVerMas(verMas === id_pedido ? null : id_pedido);
      return;
    }
    fetch(`http://127.0.0.1:8000/pedidos/${id_pedido}/productos`)
      .then(res => res.json())
      .then(productos => {
        setProductosPedido(prev => ({ ...prev, [id_pedido]: productos }));
        setVerMas(id_pedido);
      });
  };

  if (!cliente) return <div>Cargando...</div>;

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="cliente-cuenta-container">
      <h2>Mi cuenta</h2>
      <button onClick={handleLogout} style={{float: 'right', marginTop: '-2.5rem', marginBottom: '1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer'}}>Cerrar sesión</button>
      <div className="cliente-info-card">
        {edit ? (
          <form onSubmit={handleUpdate} className="cliente-form">
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" required />
            <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} placeholder="Apellido" required />
            <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="Teléfono" />
            <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección" />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setEdit(false)}>Cancelar</button>
          </form>
        ) : (
          <>
            <p><b>Nombre:</b> {cliente.nombre}</p>
            <p><b>Apellido:</b> {cliente.apellido}</p>
            <p><b>Teléfono:</b> {cliente.telefono}</p>
            <p><b>Dirección:</b> {cliente.direccion}</p>
            <button onClick={() => setEdit(true)}>Actualizar información</button>
          </>
        )}
      </div>

      <h3>Mis pedidos</h3>
      <div className="pedidos-lista">
        {pedidos.length === 0 && <p>No tienes pedidos.</p>}
        {pedidos.map(pedido => (
          <div key={pedido.id_pedido} className="pedido-card">
            <p><b>Pedido:</b> {pedido.id_pedido}</p>
            <p><b>Estado:</b> {pedido.estado}</p>
            <p><b>Dirección de envío:</b> {pedido.direccion_envio}</p>
            <p><b>Fecha:</b> {pedido.fecha_pedido}</p>
            <p><b>Método de pago:</b> {pedido.metodo_pago}</p>
            <button onClick={() => handleVerMas(pedido.id_pedido)}>
              {verMas === pedido.id_pedido ? "Ocultar productos" : "Ver productos"}
            </button>
            {verMas === pedido.id_pedido && productosPedido[pedido.id_pedido] && (
              <ul>
                {productosPedido[pedido.id_pedido].map(prod => (
                  <li key={prod.id_producto}>
                    <b>{prod.nombre}</b> - {prod.descripcion} - ${prod.precio}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClienteCuenta;
