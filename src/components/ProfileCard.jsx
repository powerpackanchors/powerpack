import React from 'react';
import { urlFor } from '../sanityClient';
import '../styles/profilecard.css';

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

const ProfileCard = ({ artist, onClick }) => {
  const getTierClass = (tier) => {
    return tier ? `tier-${tier.toLowerCase()}` : '';
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-card" onClick={() => onClick(artist)}>
      <div className="card-header">
        <div className="avatar-wrapper">
          {artist.photo ? (
            <img 
              src={urlFor(artist.photo).width(120).height(120).quality(80).fit('crop').url()} 
              alt={artist.name || 'Artist'} 
              className="card-avatar-placeholder" 
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="card-avatar-placeholder">{getInitials(artist.name)}</div>
          )}
          <div className="card-name-info">
            <h4 className="card-name">{artist.name || 'Anonymous'}</h4>
            <span className="card-languages">{(artist.languages || []).join(', ')}</span>
          </div>
        </div>
        <div className={`tier-badge ${getTierClass(artist.tier)}`}>
          {artist.tier || 'Open'}
        </div>
      </div>

      <div className="card-stats">
        <div className="mini-stat">
          <span className="mini-stat-value">{formatExperience(artist.experience)}</span>
          <span className="mini-stat-label">Experience</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value">{formatEvents(artist.eventsCount)}</span>
          <span className="mini-stat-label">Events</span>
        </div>
      </div>

      <div className="card-tags">
        {(artist.specialisations || []).map((spec, index) => (
          <span key={index} className="tag-pill">{spec}</span>
        ))}
      </div>

      <div className="card-footer">
        <span className="view-profile-link">View Profile →</span>
      </div>
    </div>
  );
};

export default ProfileCard;
