import React from 'react';
import '../styles/cta.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-glow"></div>
      <div className="cta-content">
        <span className="cta-eyebrow">Ready to Book?</span>
        <h2>
          Find the Perfect Artist for Your <br />
          <span className="gradient-text">Next Event</span>
        </h2>
        <p className="cta-subtext">
          Join hundreds of event planners who trust PowerPack Community to deliver unforgettable experiences.
        </p>
        
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>
            Browse Artists
          </button>
          <button className="btn-secondary">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
