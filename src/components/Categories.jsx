import React, { useState, useEffect } from 'react';
import { FiMic, FiMusic, FiUsers, FiVideo, FiArrowRight } from 'react-icons/fi';
import { client } from '../sanityClient';
import { getCached, setCached } from '../utils/sanityCache';
import '../styles/categories.css';

const Categories = ({ activeCategory, onCategoryChange }) => {
  const [counts, setCounts] = useState({
    anchors: 0,
    djs: 0,
    choreographers: 0,
    reelCreators: 0
  });

  useEffect(() => {
    const cacheKey = 'counts_all';
    const cached = getCached(cacheKey);

    if (cached) {
      setCounts(cached);
      return;
    }

    client.fetch(`{
      "anchors": count(*[_type == "artist" && category == "Anchors"]),
      "djs": count(*[_type == "artist" && category == "DJs"]),
      "choreographers": count(*[_type == "artist" && category == "Choreographers"]),
      "reelCreators": count(*[_type == "artist" && category == "Reel Creators"])
    }`)
      .then(data => {
        if (data) {
          setCounts(data);
          setCached(cacheKey, data);
        }
      })
      .catch(err => console.error('Error fetching artist counts:', err));
  }, []);

  const handleCategoryHover = (category) => {
    const categoryMap = {
      anchors: 'Anchors',
      djs: 'DJs',
      choreographers: 'Choreographers',
      reelcreators: 'Reel Creators'
    };
    const sanityCat = categoryMap[category];
    if (!sanityCat) return;

    const cacheKey = `artists_${category.toLowerCase()}`;
    if (getCached(cacheKey)) return; // already cached

    client.fetch(
      `*[_type == "artist" && category == $category][0...6]`,
      { category: sanityCat }
    )
      .then(data => {
        setCached(cacheKey, data);
      })
      .catch(err => console.error('Error prefetching artists:', err));
  };

  const categories = [
    { id: 'anchors', title: 'Anchors', count: `${counts.anchors || 0} Artists`, icon: <FiMic /> },
    { id: 'djs', title: 'DJs', count: `${counts.djs || 0} Artists`, icon: <FiMusic /> },
    { id: 'choreographers', title: 'Choreographers', count: `${counts.choreographers || 0} Crews`, icon: <FiUsers /> },
    { id: 'reelcreators', title: 'Reel Creators', count: `${counts.reelCreators || 0} Creators`, icon: <FiVideo /> }
  ];

  return (
    <section id="categories" className="categories-section">
      <div className="section-container">
        <span className="section-label">Browse by Category</span>
        
        <div className="categories-grid">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
              onMouseEnter={() => handleCategoryHover(cat.id)}
            >
              <div className="category-icon-wrapper">
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
              <div className="category-footer">
                <span className="category-count">{cat.count}</span>
                <FiArrowRight className="category-arrow" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
