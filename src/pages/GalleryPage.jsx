import React, { useEffect, useRef, useState } from 'react';
import ReelCard from '../components/ReelCard';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import './GalleryPage.css';

const ReelSection = ({ title, videos = [], badge }) => {
  const trackRef = useRef(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

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

  return (
    <div className="reel-section">
      <h2 className="reel-section-title">{title}</h2>
      <div 
        className="reels-scroll-wrapper"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="reels-track">
          {videos.map((video) => (
            <ReelCard key={video._id || video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const cacheKey = 'gallery_all';
    const cached = getCached(cacheKey);

    if (cached) {
      setReels(cached);
      setLoading(false);
      return;
    }

    client.fetch(`*[_type == "reel"]`)
      .then(data => {
        setReels(data);
        setCached(cacheKey, data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reels:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="gallery-page" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  const anchorVideos = reels.filter(r => r.category === 'Anchors');
  const djVideos = reels.filter(r => r.category === 'DJs');
  const choreographerVideos = reels.filter(r => r.category === 'Choreographers');
  const reelCreatorVideos = reels.filter(r => r.category === 'Reel Creators');

  return (
    <div className="gallery-page" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
      <ReelSection title="Anchor Reels" videos={anchorVideos} badge="ANCHORS" />
      <ReelSection title="DJ Reels" videos={djVideos} badge="DJS" />
      <ReelSection title="Choreographer Reels" videos={choreographerVideos} badge="CHOREOGRAPHERS" />
      <ReelSection title="Reel Creator Reels" videos={reelCreatorVideos} badge="REEL CREATORS" />
    </div>
  );
};

export default GalleryPage;
