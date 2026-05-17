import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ReelCard from './ReelCard';
import '../styles/gallery.css';

const Gallery = ({ videos, title = "Trending Reels", showViewAll = false, isGrid = false }) => {
  const trackRef = useRef(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e) => {
    isDown = true;
    const innerTrack = trackRef.current?.querySelector('.reels-track');
    if (innerTrack) innerTrack.style.animationPlayState = 'paused';
    startX = e.pageX - trackRef.current.offsetLeft;
    scrollLeft = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    const innerTrack = trackRef.current?.querySelector('.reels-track');
    if (innerTrack) innerTrack.style.animationPlayState = 'running';
  };

  const handleMouseUp = () => {
    isDown = false;
    const innerTrack = trackRef.current?.querySelector('.reels-track');
    if (innerTrack) innerTrack.style.animationPlayState = 'running';
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="gallery-section">
      <div className="section-container">
        <div className="gallery-header">
          <h2 className="gallery-title">{title}</h2>
        </div>
        
        {isGrid ? (
          <div className="gallery-grid">
            {videos.map((video) => (
              <ReelCard key={video._id || video.id} video={video} />
            ))}
          </div>
        ) : (
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
        )}
        
        {showViewAll && (
          <div className="gallery-footer">
            <Link to="/gallery" className="btn-secondary">
              View Full Gallery →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
