import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/productos/")
      .then(res => res.json())
      .then(data => {
        // Selecciona 4 productos aleatorios
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProductos(shuffled.slice(0, 4));
      });
  }, []);

  return (
    <div className="home-container">
      {/* Primera fila: Bienvenida */}
      <motion.section
        className="home-bienvenida"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="home-bienvenida-texto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h1>¡Bienvenido a Rosaline Bakery!</h1>
          <p>
            Disfruta de los mejores postres artesanales, hechos con amor y los mejores ingredientes. 
            Explora nuestro menú y déjate tentar por nuestros sabores únicos.
          </p>
        </motion.div>
        <motion.div
          className="home-bienvenida-imagen"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <img
            src={process.env.PUBLIC_URL + "/img/cookieshome.jpg"}
            alt="Bienvenida Rosaline Bakery"
            className="home-imagen-real"
          />
        </motion.div>
      </motion.section>

      {/* Segunda fila: Productos aleatorios */}
      <motion.section
        className="home-productos-destacados"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <h2>¡Prueba nuestros favoritos!</h2>
        <div className="home-productos-grid">
          {productos.map((producto, idx) => (
            <motion.div
              key={producto.id_producto}
              className="home-producto-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.15, duration: 0.5 }}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/producto/${producto.id_producto}`)}
            >
              <div className="home-producto-img">
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} />
                ) : (
                  <span style={{ color: "#888", fontWeight: "bold" }}>Imagen</span>
                )}
              </div>
              <h3>{producto.nombre}</h3>
              <p className="home-producto-precio">${producto.precio}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tercera fila: Inspiración */}
      <motion.section
        className="home-inspiracion"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="home-inspiracion-content">
          <div className="home-inspiracion-col">
            <h2>¿Por qué elegir Rosaline Bakery?</h2>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
            >
              {[
                "🍰 Recetas originales y saludables",
                "🌱 Ingredientes frescos y de calidad",
                "🎂 Opciones para todos los gustos: tradicional y saludable",
                "🚚 Entrega rápida y segura en tu ciudad",
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + idx * 0.2, duration: 0.5 }}
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="home-inspiracion-col home-inspiracion-texto">
            <h3>Sobre nosotros</h3>
            <p>
              Somos un emprendimiento que hace sus productos con amor, dedicación y pasión por la repostería. 
              Cada postre es una experiencia única, pensada para alegrar tus momentos especiales.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
