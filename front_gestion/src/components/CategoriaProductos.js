import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaShoppingCart, FaLeaf, FaStar, FaRegClock, FaArrowRight } from "react-icons/fa";
import "../styles/CategoriaProductos.css";

function CategoriaProductos() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Obtener datos de la categoría
        const [categoriasRes, productosRes] = await Promise.all([
          fetch(`https://backrosaline-production.up.railway.app/categorias/`),
          fetch(`https://backrosaline-production.up.railway.app/categorias/${id}/productos`)
        ]);

        if (!categoriasRes.ok || !productosRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const categoriasData = await categoriasRes.json();
        const productosData = await productosRes.json();

        const cat = categoriasData.find(c => c.id_categoria === parseInt(id));
        if (!cat) {
          throw new Error('Categoría no encontrada');
        }

        setCategoria(cat);
        setProductos(productosData);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!categoria) return null;

  return (
    <div className="categoria-productos-container">
      <motion.div
        className="categoria-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          className="back-button"
          onClick={() => {
            const nextCategoryId = id === '1' ? '2' : '1';
            navigate(`/categoria/${nextCategoryId}`);
          }}
          aria-label="Cambiar categoría"
        >
          <FaArrowRight /> Cambiar Categoría
        </button>
        
        <div className="categoria-header-content">
          <motion.h1
            className="categoria-nombre"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categoria.nombre}
          </motion.h1>
          <motion.p
            className="categoria-descripcion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {categoria.descripcion_larga || categoria.descripcion_corta}
          </motion.p>
        </div>
      </motion.div>
      <motion.h2
        className="categoria-productos-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Productos
      </motion.h2>
      <AnimatePresence>
        <motion.div 
          className="productos-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {productos.length > 0 ? (
            productos.map((producto) => (
              <motion.div
                key={producto.id_producto}
                className="producto-card"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => navigate(`/producto/${producto.id_producto}`)}
              >
                <div className="producto-imagen">
                  {producto.imagen_url ? (
                    <img 
                      src={producto.imagen_url} 
                      alt={producto.nombre} 
                      loading="lazy"
                    />
                  ) : (
                    <div className="producto-imagen-placeholder">
                      <span>Sin imagen</span>
                    </div>
                  )}
                  {producto.destacado && (
                    <div className="producto-destacado">
                      <FaStar /> Destacado
                    </div>
                  )}
                  {producto.es_vegano && (
                    <div className="producto-vegano">
                      <FaLeaf /> Vegano
                    </div>
                  )}
                </div>
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <p className="producto-descripcion">
                    {producto.descripcion_corta?.substring(0, 80)}{producto.descripcion_corta?.length > 80 ? '...' : ''}
                  </p>
                  <div className="producto-meta">
                    {producto.tiempo_preparacion && (
                      <span className="tiempo-preparacion">
                        <FaRegClock /> {producto.tiempo_preparacion} min
                      </span>
                    )}
                    <span className="producto-precio">${producto.precio?.toLocaleString()}</span>
                  </div>
                  <button 
                    className="producto-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para agregar al carrito
                    }}
                  >
                    <FaShoppingCart /> Añadir
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-productos">
              <p>No hay productos disponibles en esta categoría.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CategoriaProductos;
