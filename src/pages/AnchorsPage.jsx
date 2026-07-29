import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import ProfileCard from '../components/ProfileCard';
import ReelCard from '../components/ReelCard';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import '../styles/categorypage.css';
import '../styles/artistsection.css';
import './AnchorsPage.css';

const AnchorsPage = ({ onArtistClick }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const [artists, setArtists] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('All');
  const [expRange, setExpRange] = useState([0, 30]);

  const handleCategoryChange = (category) => {
    if (category === 'reelcreators') {
      navigate('/reel-creators');
    } else {
      navigate(`/${category}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const cachedArtists = getCached('artists_anchors');
    const cachedReels = getCached('reels_anchors');

    if (cachedArtists && cachedReels) {
      setArtists(cachedArtists);
      setReels(cachedReels);
      setLoading(false);
      return;
    }

    Promise.all([
      client.fetch(`*[_type == "artist" && category == "Anchors"] | order(name asc)`),
      client.fetch(`*[_type == "reel" && category == "Anchors"]`)
    ])
      .then(([artistsData, reelsData]) => {
        setArtists(artistsData);
        setReels(reelsData);
        setCached('artists_anchors', artistsData);
        setCached('reels_anchors', reelsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching Anchors data:', err);
        setLoading(false);
      });
  }, []);

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - trackRef.current.offsetLeft;
    scrollLeft = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { isDown = false; };
  const handleMouseUp = () => { isDown = false; };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const filteredArtists = artists.filter(artist => {
    // Tier filter
    const tierMatch = tierFilter === 'All' || artist.tier === tierFilter

    // Experience filter
    const exp = parseInt(artist.experience) || 0
    const expMatch = exp >= expRange[0] && exp <= expRange[1]

    return tierMatch && expMatch
  })

  if (loading) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Categories activeCategory="anchors" onCategoryChange={handleCategoryChange} />
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <Categories activeCategory="anchors" onCategoryChange={handleCategoryChange} />
      
      <section id="anchors" className="artist-section">
        <div className="section-container">
          <div className="artist-section-header">
            <h2 className="artist-section-title">Top Anchors</h2>
            <span className="sec-pill">{filteredArtists.length} Artists</span>
          </div>

          <div className="anchor-filters">
            {/* Tier Filter */}
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

            {/* Experience Range Slider */}
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
                    const val = parseInt(e.target.value)
                    if (val < expRange[1]) setExpRange([val, expRange[1]])
                  }}
                  className="range-input range-min"
                />
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={expRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val > expRange[0]) setExpRange([expRange[0], val])
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

            {/* Reset filters */}
            {(tierFilter !== 'All' || expRange[0] !== 0 || expRange[1] !== 30) && (
              <button
                className="reset-filters-btn"
                onClick={() => { setTierFilter('All'); setExpRange([0, 30]) }}
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="artists-grid">
            {filteredArtists.map(artist => (
              <ProfileCard key={artist._id || artist.id} artist={artist} onClick={onArtistClick} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="gallery-section">
        <div className="section-container">
          <div className="gallery-header">
            <h2 className="gallery-title">Anchor Reels</h2>
          </div>
          
          <div 
            className="reels-scroll-wrapper"
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="reels-track">
              {reels.map((video) => (
                <ReelCard key={video._id || video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnchorsPage;
