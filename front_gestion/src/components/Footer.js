import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-info">
            © 2024 Nombre de la Tienda. Todos los derechos reservados.
          </div>
          <div className="footer-info">
            Dirección: Calle Ficticia 123, Ciudad, País
          </div>
        </div>
        <div className="footer-col">
          <div>
            Contacto: info@tienda.com<br />
            Tel: +00 123 456 7890
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
