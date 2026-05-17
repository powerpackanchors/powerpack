import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReelCreatorSection from '../components/ReelCreatorSection';
import Categories from '../components/Categories';
import ReelCard from '../components/ReelCard';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import '../styles/categorypage.css';

const ReelCreatorsPage = ({ onArtistClick }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const [artists, setArtists] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryChange = (category) => {
    if (category === 'reelcreators') {
      navigate('/reel-creators');
    } else {
      navigate(`/${category}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const cachedArtists = getCached('artists_reelcreators');
    const cachedReels = getCached('reels_reelcreators');

    if (cachedArtists && cachedReels) {
      setArtists(cachedArtists);
      setReels(cachedReels);
      setLoading(false);
      return;
    }

    Promise.all([
      client.fetch(`*[_type == "artist" && category == "Reel Creators"] | order(name asc)`),
      client.fetch(`*[_type == "reel" && category == "Reel Creators"]`)
    ])
      .then(([artistsData, reelsData]) => {
        setArtists(artistsData);
        setReels(reelsData);
        setCached('artists_reelcreators', artistsData);
        setCached('reels_reelcreators', reelsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching Reel Creators data:', err);
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

  if (loading) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Categories activeCategory="reelcreators" onCategoryChange={handleCategoryChange} />
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
      <Categories activeCategory="reelcreators" onCategoryChange={handleCategoryChange} />
      
      <ReelCreatorSection artists={artists} onArtistClick={onArtistClick} showViewAll={false} />
      
      <section className="gallery-section">
        <div className="section-container">
          <div className="gallery-header">
            <h2 className="gallery-title">Reel Creator Videos</h2>
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

export default ReelCreatorsPage;
