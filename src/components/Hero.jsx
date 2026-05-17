import React, { useState, useEffect } from 'react';
import '../styles/hero.css';

const Hero = () => {
  const [artistsCount, setArtistsCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    const animateCount = (target, setter, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
      return timer;
    };

    const t1 = animateCount(200, setArtistsCount);
    const t2 = animateCount(3, setYearsCount);
    const t3 = animateCount(1000, setEventsCount);
    const t4 = animateCount(4, setCategoriesCount);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
      clearInterval(t3);
      clearInterval(t4);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-glow"></div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <div className="badge-dot"></div>
          <span>India's Premier Artist Community</span>
        </div>
        
        <h1 className="hero-title">
          <span className="line-1">Connect with</span>
          <span className="line-2">the Best</span>
          <span className="line-3 gradient-text">Event Artists</span>
        </h1>
        
        <p className="hero-subtitle">
          Discover and book top-tier anchors, DJs, choreographers, and reel creators for your next big event. Curated professionals, seamless booking.
        </p>
        
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>
            Browse Artists
          </button>
          <button className="btn-secondary">
            How it Works
          </button>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">{artistsCount}+</span>
            <span className="stat-label">Artists</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{yearsCount}+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{eventsCount}+</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{categoriesCount}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
