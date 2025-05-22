import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-info">
            © 2025 Rosaline Bakery. Todos los derechos reservados.
          </div>
          <div className="footer-info">
            Dirección: Calle. 50 # 3W-45 , Neiva, Colombia
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-contact">
            <a 
              href="https://www.instagram.com/rosaline_bakeryy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-link"
            >
              <FaInstagram className="instagram-icon" />
              <span>rosaline_bakeryy</span>
            </a>
            <a 
              href="https://api.whatsapp.com/send/?phone=573138485657&text=Hola%2C+quisiera+saber+m%C3%A1s+sobre...&type=phone_number&app_absent=0" 
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              <FaWhatsapp className="whatsapp-icon" />
              <span>+57 313 848 5657</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
