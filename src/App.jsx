import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfileModal from './components/ProfileModal';
import Home from './pages/Home';
import AnchorsPage from './pages/AnchorsPage';
import DJsPage from './pages/DJsPage';
import ChoreographersPage from './pages/ChoreographersPage';
import ReelCreatorsPage from './pages/ReelCreatorsPage';
import GalleryPage from './pages/GalleryPage';
import JoinPage from './pages/JoinPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [selectedArtist, setSelectedArtist] = useState(null);

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home onArtistClick={handleArtistClick} />} />
          <Route path="/anchors" element={<AnchorsPage onArtistClick={handleArtistClick} />} />
          <Route path="/djs" element={<DJsPage onArtistClick={handleArtistClick} />} />
          <Route path="/choreographers" element={<ChoreographersPage onArtistClick={handleArtistClick} />} />
          <Route path="/reel-creators" element={<ReelCreatorsPage onArtistClick={handleArtistClick} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/join" element={<JoinPage />} />
        </Routes>
      </main>
      
      <Footer />
      
      {selectedArtist && (
        <ProfileModal 
          artist={selectedArtist} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default App;
