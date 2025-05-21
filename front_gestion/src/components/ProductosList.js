import React, { useEffect, useState } from "react";
import '../styles/ProductosList.css';

function ProductosList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("https://backrosaline-production.up.railway.app/productos/")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  return (
    <div className="productos-list-container">
      <h1 className="productos-title">Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id_producto} className="producto-card">
            <h2 className="producto-nombre">{producto.nombre}</h2>
            <p className="producto-precio">${producto.precio}</p>
            {/* Aquí puedes agregar botón para agregar al carrito */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosList;
