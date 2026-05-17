import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import '../styles/artistsection.css';

const ChoreographerSection = ({ artists = [], onArtistClick, showViewAll = false }) => {
  const isMobile = window.innerWidth <= 768;
  const displayCount = isMobile ? 5 : 6;
  const artistsToDisplay = showViewAll ? artists.slice(0, displayCount) : artists;

  const [artistCount, setArtistCount] = useState(0);

  useEffect(() => {
    const globalCached = getCached('counts_all');
    if (globalCached && globalCached.choreographers !== undefined) {
      setArtistCount(globalCached.choreographers);
      return;
    }

    const cacheKey = 'counts_choreographers';
    const cached = getCached(cacheKey);
    if (cached !== null) {
      setArtistCount(cached);
      return;
    }

    client.fetch(`count(*[_type == "artist" && category == "Choreographers"])`)
      .then(count => {
        setArtistCount(count);
        setCached(cacheKey, count);
      })
      .catch(err => console.error('Error fetching count:', err));
  }, []);

  return (
    <section id="choreographers" className="artist-section">
      <div className="section-container">
        <div className="artist-section-header">
          <h2 className="artist-section-title">Choreographers & Crews</h2>
          <div className="artist-count-pill">{artistCount || 0} Crews</div>
        </div>
        
        <div className="artists-grid">
          {artistsToDisplay.map((artist) => (
            <ProfileCard key={artist._id || artist.id} artist={artist} onClick={onArtistClick} />
          ))}
        </div>
        
        {showViewAll && (
          <div className="artist-section-footer">
            <Link to="/choreographers" className="btn-secondary">View All Choreographers →</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChoreographerSection;
