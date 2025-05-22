import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaInstagram } from 'react-icons/fa';
import '../styles/SobreNosotros.css';

function SobreNosotros() {
  const [showContactInfo, setShowContactInfo] = useState(false);
  return (
    <motion.div 
      className="sobre-nosotros-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="sobre-nosotros-hero">
        <div className="sobre-nosotros-hero-content">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Nuestra Historia
          </motion.h1>
          <motion.p 
            className="sobre-nosotros-subtitulo"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Endulzando momentos desde 2024
          </motion.p>
        </div>
      </section>

      <section className="sobre-nosotros-contenido">
        <motion.div 
          className="sobre-nosotros-tarjeta"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Nuestros Inicios</h2>
          <p>
            Rosaline Bakery nació en el corazón de Neiva en el año 2024, fruto de la pasión por la repostería y el deseo de compartir momentos dulces con nuestra comunidad. Lo que comenzó como un pequeño emprendimiento familiar, hoy se ha convertido en un referente de calidad y sabor en la región.
          </p>
        </motion.div>

        <motion.div 
          className="sobre-nosotros-tarjeta"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Nuestra Filosofía</h2>
          <p>
            Creemos en la repostería como una forma de arte y expresión. Cada producto que sale de nuestro horno está elaborado con ingredientes de la más alta calidad, dedicación y, sobre todo, mucho amor. Nos esforzamos por mantener viva la tradición repostera mientras innovamos con nuevos sabores y técnicas.
          </p>
        </motion.div>

        <motion.div 
          className="sobre-nosotros-valores"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-item">
              <div className="valor-icono">🍰</div>
              <h3>Calidad</h3>
              <p>Usamos solo los mejores ingredientes para garantizar el mejor sabor en cada bocado.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icono">❤️</div>
              <h3>Pasión</h3>
              <p>Amamos lo que hacemos y eso se refleja en cada uno de nuestros productos.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icono">✨</div>
              <h3>Creatividad</h3>
              <p>Innovamos constantemente para sorprender a nuestros clientes con nuevos sabores.</p>
            </div>
            <div className="valor-item">
              <div className="valor-icono">🤝</div>
              <h3>Compromiso</h3>
              <p>Nos comprometemos con la satisfacción total de nuestros clientes.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="sobre-nosotros-equipo"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Nuestro Equipo</h2>
          <p>
            Detrás de Rosaline Bakery hay un equipo apasionado por la repostería, liderado por expertos pasteleros con años de experiencia. Cada miembro de nuestro equipo comparte la misma visión: crear experiencias memorables a través de la repostería.
          </p>
        </motion.div>
      </section>

      <section className="sobre-nosotros-cta">
        <motion.div 
          className="cta-content"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>¿Listo para probar nuestros productos?</h2>
          <p>Visítanos y descubre por qué somos la mejor opción en repostería en Neiva.</p>
          <button 
            className="cta-button"
            onClick={() => setShowContactInfo(!showContactInfo)}
          >
            {showContactInfo ? 'Ocultar Contacto' : 'Contáctanos'}
          </button>
          
          <AnimatePresence>
            {showContactInfo && (
              <motion.div 
                className="contact-info"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="welcome-message">
                  <h3>¡Estamos aquí para ti!</h3>
                  <p>
                    Escríbenos y con mucho gusto te atenderemos en cualquiera de nuestras redes sociales. 
                    Estamos comprometidos a responder tus consultas lo antes posible y ayudarte con tus pedidos especiales, 
                    cotizaciones o cualquier pregunta que tengas sobre nuestros deliciosos productos.
                  </p>
                  <p className="business-hours">
                    Horario de atención: Lunes a Sábado de 8:00 AM a 7:00 PM
                  </p>
                </div>
                
                <div className="contact-details">
                  <h4>Contáctanos por:</h4>
                  <div className="contact-info-item">
                    <FaEnvelope className="contact-icon" />
                    <a href="mailto:rosalinebakerycol@gmail.com">rosalinebakerycol@gmail.com</a>
                  </div>
                  <div className="contact-info-item">
                    <FaInstagram className="contact-icon" />
                    <a href="https://www.instagram.com/rosaline_bakeryy" target="_blank" rel="noopener noreferrer">
                      @rosaline_bakeryy
                    </a>
                  </div>
                  <div className="contact-info-item">
                    <FaPhone className="contact-icon" />
                    <a href="tel:+573138485657">+57 313 848 5657</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </motion.div>
  );
}

export default SobreNosotros;
