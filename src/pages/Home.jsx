import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import AnchorSection from '../components/AnchorSection';
import DJSection from '../components/DJSection';
import ChoreographerSection from '../components/ChoreographerSection';
import ReelCreatorSection from '../components/ReelCreatorSection';
import FounderSection from '../components/FounderSection';
import CTASection from '../components/CTASection';
import Gallery from '../components/Gallery';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';

const Home = ({ onArtistClick }) => {
  const [activeCategory, setActiveCategory] = useState('anchors');
  const [artists, setArtists] = useState([]);
  const [reels, setReels] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [reelsLoading, setReelsLoading] = useState(true);

  const categoryMap = {
    anchors: 'Anchors',
    djs: 'DJs',
    choreographers: 'Choreographers',
    reelcreators: 'Reel Creators'
  };

  useEffect(() => {
    const cacheKey = `artists_${activeCategory.toLowerCase()}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setArtists(cached);
      setArtistsLoading(false);
      return;
    }

    setArtistsLoading(true);
    client.fetch(`*[_type == "artist" && category == $category][0...6]`, { 
      category: categoryMap[activeCategory] 
    })
      .then(data => {
        setArtists(data);
        setCached(cacheKey, data);
        setArtistsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching artists:', err);
        setArtistsLoading(false);
      });
  }, [activeCategory]);

  useEffect(() => {
    const cacheKey = 'gallery_all';
    const cached = getCached(cacheKey);

    if (cached) {
      setReels(cached);
      setReelsLoading(false);
      return;
    }

    setReelsLoading(true);
    client.fetch(`*[_type == "reel"]`)
      .then(data => {
        setReels(data);
        setCached(cacheKey, data);
        setReelsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reels:', err);
        setReelsLoading(false);
      });
  }, []);

  return (
    <>
      <Hero />
      <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      {artistsLoading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : (
        <>
          {activeCategory === 'anchors' && <AnchorSection artists={artists} onArtistClick={onArtistClick} showViewAll={true} />}
          {activeCategory === 'djs' && <DJSection artists={artists} onArtistClick={onArtistClick} showViewAll={true} />}
          {activeCategory === 'choreographers' && <ChoreographerSection artists={artists} onArtistClick={onArtistClick} showViewAll={true} />}
          {activeCategory === 'reelcreators' && <ReelCreatorSection artists={artists} onArtistClick={onArtistClick} showViewAll={true} />}
        </>
      )}
      
      {reelsLoading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : (
        <Gallery videos={reels} title="Trending Reels" showViewAll={true} />
      )}
      
      <FounderSection />
      
      <div id="contact">
        <CTASection />
      </div>
    </>
  );
};

export default Home;
