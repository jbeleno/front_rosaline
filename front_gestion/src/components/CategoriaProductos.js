import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/CategoriaProductos.css";

function CategoriaProductos() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener datos de la categoría
    fetch(`http://127.0.0.1:8000/categorias/`)
      .then(res => res.json())
      .then(data => {
        const cat = data.find(c => c.id_categoria === parseInt(id));
        setCategoria(cat);
      });

    // Obtener productos de la categoría
    fetch(`http://127.0.0.1:8000/categorias/${id}/productos`)
      .then(res => res.json())
      .then(data => setProductos(data));
  }, [id]);

  if (!categoria) return <div className="categoria-productos-container">Cargando...</div>;

  return (
    <motion.div
      className="categoria-productos-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h1
        className="categoria-nombre"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {categoria.nombre}
      </motion.h1>
      <motion.p
        className="categoria-descripcion"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {categoria.descripcion_larga || categoria.descripcion_corta}
      </motion.p>
      <motion.h2
        className="categoria-productos-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Productos
      </motion.h2>
      <div className="categoria-productos-grid">
        {productos.map((producto, idx) => (
          <motion.div
            key={producto.id_producto}
            className="categoria-producto-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + idx * 0.15, duration: 0.5 }}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/producto/${producto.id_producto}`)}
          >
            <div className="categoria-producto-img">
              {producto.imagen_url ? (
                <img src={producto.imagen_url} alt={producto.nombre} />
              ) : (
                <span style={{ color: "#888", fontWeight: "bold" }}>Imagen</span>
              )}
            </div>
            <h3 className="categoria-producto-nombre">{producto.nombre}</h3>
            <p className="categoria-producto-precio">${producto.precio}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default CategoriaProductos;
