import React, { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movie) => {
    try {
      const updated = await removeFromWishlist(movie.id);
      setWishlist(updated || []);
    } catch (err) {
      setWishlist(prev => prev.filter(m => m.id !== movie.id));
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading Wishlist...</div>;

  return (
    <div style={{ padding: '25px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <h2 style={{ marginBottom: '20px' }}>Saved Wishlist</h2>
      {wishlist.length === 0 ? (
        <p style={{ color: '#aaa' }}>Your wishlist is empty.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {wishlist.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isWishlisted={true}
              onWishlistToggle={handleRemove}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      )}
      <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}