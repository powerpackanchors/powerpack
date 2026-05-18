import React from 'react';
import '../styles/founder.css';

const FounderSection = () => {
  return (
    <section id="about" className="founder-section">
      <div className="section-container founder-container">
        <div className="founder-image-wrapper">
          <div className="founder-image-border">
            <img
              src="https://res.cloudinary.com/dp3osieuu/image/upload/v1779105855/1760003849507.jpg_juudsv.png"
              alt="Akash Ada — Founder PowerPack"
              className="founder-img"
            />
          </div>
        </div>
        
        <div className="founder-content">
          <span className="founder-eyebrow">The Founder</span>
          <h2>Akash Ada</h2>
          <span className="founder-title">Founder & CEO, PowerPack Community</span>
          
          <p className="founder-bio">
            With over 15 years in the event management industry, Akash saw a massive gap between exceptional talent and the people who needed them. PowerPack was built to bridge this gap, ensuring that every event has the perfect artist, and every artist gets the recognition they deserve.
          </p>
          
          <blockquote className="founder-quote">
            "We don't just provide artists for events. We curate experiences that leave lasting memories."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
