import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
        POWER<span className="logo-accent">PACK</span>
      </Link>
      
      <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link to="/anchors" onClick={() => setMobileMenuOpen(false)}>Artists</Link>
        <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
        <button className="navbar-book-btn">Book an Artist</button>
      </div>

      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>
    </nav>
  );
};

export default Navbar;
