import React, { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiStar, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { urlFor } from '../sanityClient';
import '../styles/profilemodal.css';

const formatExperience = (exp) => {
  if (!exp) return 'N/A'
  const isOnlyNumber = /^\d+$/.test(exp.trim())
  return isOnlyNumber ? `${exp} years` : exp
}

const formatEvents = (count) => {
  if (!count) return 'N/A'
  const isOnlyNumber = /^\d+$/.test(count.trim())
  return isOnlyNumber ? `${count}+` : count
}

const ProfileModal = ({ artist, onClose }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyInstagram = () => {
    if (artist.instagramHandle) {
      navigator.clipboard.writeText(artist.instagramHandle)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!artist) return null;

  const getTierClass = (tier) => tier ? `tier-${tier.toLowerCase()}` : '';

  const handleOverlayClick = (e) => {
    if (e.target.className.includes('modal-overlay')) onClose();
  };

  const handleWhatsapp = () => {
    const message = encodeURIComponent(`Hi, I would like to enquire about booking ${artist.name || ''}.`);
    window.open(`https://wa.me/${919574188444 || ''}?text=${message}`, '_blank');
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-accent-bar"></div>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        
        <div className="modal-header">
          {artist.photo ? (
            <img 
              src={urlFor(artist.photo).width(200).height(200).quality(85).fit('crop').url()} 
              alt={artist.name || ''} 
              className="modal-avatar-placeholder" 
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="modal-avatar-placeholder">{getInitials(artist.name)}</div>
          )}
          <div className="modal-info">
            <h2>{artist.name || 'Anonymous'}</h2>
            <span className="modal-role">{artist.city || 'Location N/A'} • Since {artist.memberSince || 'N/A'}</span>
            <div className={`tier-badge ${getTierClass(artist.tier)}`} style={{ display: 'inline-block' }}>
              {artist.tier || 'Open'} Artist
            </div>
          </div>
        </div>

        <div className="modal-stats-grid">
          <div className="modal-stat-box">
            <span className="modal-stat-value">{artist.city || 'N/A'}</span>
            <span className="modal-stat-label">City</span>
          </div>
          <div className="modal-stat-box">
            <span className="modal-stat-value">{formatExperience(artist.experience)}</span>
            <span className="modal-stat-label">Experience</span>
          </div>
          <div className="modal-stat-box">
            <span className="modal-stat-value">{formatEvents(artist.eventsCount)}</span>
            <span className="modal-stat-label">Events</span>
          </div>
          <div className="modal-stat-box instagram-stat" onClick={handleCopyInstagram}>
            <span className="modal-stat-value instagram-handle">
              {copied ? 'Copied!' : (artist.instagramHandle || 'N/A')}
            </span>
            <span className="modal-stat-label">
              Instagram {artist.instagramHandle && <span className="copy-icon">⧉</span>}
            </span>
          </div>
        </div>

        <div className="modal-section">
          <h3>About</h3>
          <p className="modal-bio">{artist.bio || 'No bio available'}</p>
        </div>

        <div className="modal-section">
          <h3>Specialisations</h3>
          <div className="modal-specs-grid">
            {(artist.specialisations || []).map((spec, idx) => (
              <div key={idx} className="modal-spec-box">
                <FiCheckCircle className="spec-icon" />
                <span className="spec-text">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>Languages Spoken</h3>
          <div className="modal-languages">
            {(artist.languages || []).map((lang, idx) => (
              <span key={idx} className="tag-pill">{lang}</span>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-whatsapp" onClick={handleWhatsapp}>
            <FaWhatsapp size={20} />
            Enquire on WhatsApp
          </button>
          <button className="btn-call" onClick={() => window.open(`tel:+${artist.whatsappNumber || ''}`)}>
            <FiPhone />
            Call Us
          </button>
          <p className="modal-note">Our team will connect you within 2 hours</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
