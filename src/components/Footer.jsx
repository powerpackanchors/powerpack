import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiYoutube } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <Link to="/" className="footer-logo">
            POWER<span className="logo-accent">PACK</span>
          </Link>
          
          <div className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/anchors">Artists</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="#">Privacy Policy</Link>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} PowerPack Community. All rights reserved.
          </span>
          
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <FiInstagram />
            </a>
            <a href="#" className="social-icon">
              <FiYoutube />
            </a>
            <a href="#" className="social-icon">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
