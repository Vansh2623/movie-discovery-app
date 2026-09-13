import React, { useState, useEffect, useMemo } from 'react';
import { getPopularMovies, searchMovies, getGenres, getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const [popularRes, genreRes, wishlistRes] = await Promise.all([
          getPopularMovies(1),
          getGenres(),
          getWishlist()
        ]);
        setMovies(popularRes.results || []);
        setGenres(genreRes.genres || []);
        setWishlist(wishlistRes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      if (searchTerm.trim()) {
        const res = await searchMovies(searchTerm, 1);
        setMovies(res.results || []);
        setActiveQuery(searchTerm);
      } else {
        const res = await getPopularMovies(1);
        setMovies(res.results || []);
        setActiveQuery('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const res = activeQuery 
        ? await searchMovies(activeQuery, nextPage)
        : await getPopularMovies(nextPage);
      
      const newItems = res.results || [];
      setMovies(prev => {
        const map = new Map(prev.map(m => [m.id, m]));
        newItems.forEach(m => map.set(m.id, m));
        return Array.from(map.values());
      });
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (movie) => {
    const exists = wishlist.some(w => w.id === movie.id);
    try {
      const updated = exists 
        ? await removeFromWishlist(movie.id)
        : await addToWishlist(movie);
      setWishlist(updated);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const filteredMovies = useMemo(() => {
    let list = [...movies];
    if (selectedGenre) {
      const gId = Number(selectedGenre);
      list = list.filter(m => m.genre_ids && m.genre_ids.includes(gId));
    }
    list.sort((a, b) => {
      if (sortBy === 'vote_average.desc') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === 'title.asc') return (a.title || '').localeCompare(b.title || '');
      return (b.popularity || 0) - (a.popularity || 0);
    });
    return list;
  }, [movies, selectedGenre, sortBy]);

  return (
    <div style={{ padding: '25px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px 15px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff', minWidth: '200px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
        
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
          <option value="popularity.desc">Sort by Popularity</option>
          <option value="vote_average.desc">Sort by Rating</option>
          <option value="title.asc">Sort by Title</option>
        </select>
      </form>

      {error && <div style={{ color: '#ff4d4f', padding: '12px', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filteredMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isWishlisted={wishlist.some(w => w.id === movie.id)}
            onWishlistToggle={toggleWishlist}
            onClick={() => setSelectedMovie(movie)}
          />
        ))}
      </div>

      {!loading && filteredMovies.length === 0 && !error && (
        <p style={{ textAlign: 'center', margin: '40px 0', color: '#aaa' }}>No movies match your search or filter.</p>
      )}

      {loading && <p style={{ textAlign: 'center', margin: '20px' }}>Loading movies...</p>}

      {!loading && filteredMovies.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={loadMore} style={{ padding: '12px 30px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}>
            Load More
          </button>
        </div>
      )}

      <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}