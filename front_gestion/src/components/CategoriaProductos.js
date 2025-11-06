import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaLeaf, FaStar, FaRegClock, FaArrowRight } from "react-icons/fa";
import { useProducts } from "../features/products/hooks/useProducts";
import { categoriaService } from "../shared/services/api/categoriaService";
import { LoadingSpinner } from "../shared/components/UI/LoadingSpinner";
import { ErrorMessage } from "../shared/components/UI/ErrorMessage";
import "../styles/CategoriaProductos.css";

function CategoriaProductos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [isLoadingCategoria, setIsLoadingCategoria] = useState(true);
  const [errorCategoria, setErrorCategoria] = useState(null);
  
  // Obtener productos filtrados por categoría
  const { productos, loading: loadingProductos, error: errorProductos } = useProducts({ categoria: id });

  // Obtener información de la categoría
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        setIsLoadingCategoria(true);
        setErrorCategoria(null);
        const cat = await categoriaService.getById(id);
        if (!cat) {
          throw new Error('Categoría no encontrada');
        }
        setCategoria(cat);
      } catch (err) {
        console.error('Error:', err);
        setErrorCategoria(err.message || 'Error al cargar la categoría');
      } finally {
        setIsLoadingCategoria(false);
      }
    };

    if (id) {
      fetchCategoria();
    }
  }, [id]);

  const isLoading = isLoadingCategoria || loadingProductos;
  const error = errorCategoria || errorProductos;

  if (isLoading) {
    return (
      <div className="categoria-productos-container">
        <LoadingSpinner message="Cargando productos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="categoria-productos-container">
        <ErrorMessage 
          message="Error al cargar los productos" 
          error={error}
          onRetry={() => window.location.reload()}
        />
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
                      navigate(`/producto/${producto.id_producto}`);
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
