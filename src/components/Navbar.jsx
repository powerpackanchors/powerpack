import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookArtist = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      // Already on homepage — just scroll
      const ctaSection = document.getElementById('cta-section');
      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On another page — navigate to homepage then scroll
      navigate('/');
      setTimeout(() => {
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection) {
          ctaSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

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
        {/* <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link> */}
        <a href="/join" className="nav-link">Join Us</a>
        <button className="navbar-book-btn nav-cta" onClick={handleBookArtist}>Book an Artist</button>
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
