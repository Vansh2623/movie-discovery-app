import React from 'react';

export default function MovieCard({ movie, isWishlisted, onWishlistToggle, onClick }) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div 
      onClick={onClick}
      style={{ background: '#1f1f1f', borderRadius: '8px', overflow: 'hidden', color: '#fff', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #333' }}
    >
      <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>{movie.title}</h3>
          <p style={{ margin: 0, color: '#ffc107', fontSize: '14px' }}>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(movie);
          }}
          style={{ marginTop: '12px', padding: '8px', border: 'none', borderRadius: '4px', background: isWishlisted ? '#dc3545' : '#0d6efd', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isWishlisted ? 'Remove Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </div>
  );
}