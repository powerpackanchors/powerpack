import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import '../styles/artistsection.css';
import '../pages/AnchorsPage.css';

const AnchorSection = ({ artists = [], onArtistClick, showViewAll = false }) => {
  const isMobile = window.innerWidth <= 768;
  const displayCount = isMobile ? 5 : 6;

  const [artistCount, setArtistCount] = useState(0);
  const [tierFilter, setTierFilter] = useState('All');
  const [expRange, setExpRange] = useState([0, 30]);

  useEffect(() => {
    const globalCached = getCached('counts_all');
    if (globalCached && globalCached.anchors !== undefined) {
      setArtistCount(globalCached.anchors);
      return;
    }

    const cacheKey = 'counts_anchors';
    const cached = getCached(cacheKey);
    if (cached !== null) {
      setArtistCount(cached);
      return;
    }

    client.fetch(`count(*[_type == "artist" && category == "Anchors"])`)
      .then(count => {
        setArtistCount(count);
        setCached(cacheKey, count);
      })
      .catch(err => console.error('Error fetching count:', err));
  }, []);

  const filteredArtists = artists.filter(artist => {
    const tierMatch = tierFilter === 'All' || artist.tier === tierFilter;
    const exp = parseInt(artist.experience) || 0;
    const expMatch = exp >= expRange[0] && exp <= expRange[1];
    return tierMatch && expMatch;
  }).slice(0, showViewAll ? displayCount : undefined);

  return (
    <section id="anchors" className="artist-section">
      <div className="section-container">
        <div className="artist-section-header">
          <h2 className="artist-section-title">Top Anchors</h2>
          <div className="artist-count-pill">{artistCount || 0} Artists</div>
        </div>

        <div className="anchor-filters">
          <div className="filter-group">
            <label className="filter-label">Filter by Tier</label>
            <div className="tier-filter-btns">
              {['All', 'Elite', 'Premium', 'Official', 'Open'].map(tier => (
                <button
                  key={tier}
                  className={`tier-btn ${tierFilter === tier ? 'active' : ''}`}
                  onClick={() => setTierFilter(tier)}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              Experience — {expRange[0]} to {expRange[1] === 30 ? '30+' : expRange[1]} years
            </label>
            <div className="range-slider-wrapper">
              <input
                type="range"
                min="0"
                max="30"
                value={expRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val < expRange[1]) setExpRange([val, expRange[1]]);
                }}
                className="range-input range-min"
              />
              <input
                type="range"
                min="0"
                max="30"
                value={expRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > expRange[0]) setExpRange([expRange[0], val]);
                }}
                className="range-input range-max"
              />
              <div className="range-track">
                <div
                  className="range-fill"
                  style={{
                    left: `${(expRange[0] / 30) * 100}%`,
                    width: `${((expRange[1] - expRange[0]) / 30) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="range-labels">
              <span>0 yrs</span>
              <span>30+ yrs</span>
            </div>
          </div>

          {(tierFilter !== 'All' || expRange[0] !== 0 || expRange[1] !== 30) && (
            <button
              className="reset-filters-btn"
              onClick={() => { setTierFilter('All'); setExpRange([0, 30]); }}
            >
              Reset Filters
            </button>
          )}
        </div>
        
        <div className="artists-grid">
          {filteredArtists.map((artist) => (
            <ProfileCard key={artist._id || artist.id} artist={artist} onClick={onArtistClick} />
          ))}
        </div>
        
        {showViewAll && (
          <div className="artist-section-footer">
            <Link to="/anchors" className="btn-secondary">View All Anchors →</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnchorSection;
