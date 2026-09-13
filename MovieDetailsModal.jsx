import React from 'react';

export default function MovieDetailsModal({ movie, onClose }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
    : null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#181818', color: '#fff', borderRadius: '10px', maxWidth: '700px', width: '100%', overflow: 'hidden', position: 'relative', border: '1px solid #444' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10, fontWeight: 'bold' }}>✕</button>
        {backdropUrl && <img src={backdropUrl} alt={movie.title} style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }} />}
        <div style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>{movie.title}</h2>
          <p style={{ color: '#aaa', margin: '0 0 15px 0' }}>Release Date: {movie.release_date || 'N/A'} | Rating: ⭐ {movie.vote_average}</p>
          <p style={{ lineHeight: '1.6', color: '#ddd' }}>{movie.overview || 'No overview available for this title.'}</p>
        </div>
      </div>
    </div>
  );
}