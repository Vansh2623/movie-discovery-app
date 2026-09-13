import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  getPopularMovies, 
  getGenres, 
  searchMovies, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  getMovieDetails,
  discoverMovies 
} from './services/api';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'wishlist'
  
  // Search, Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Loading & Selected Movie Modal State
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchGenresAndWishlist();
  }, []);

  useEffect(() => {
    if (activeTab === 'home') {
      fetchMovies(page, selectedGenre, searchQuery);
    }
  }, [page, selectedGenre, activeTab]);

  const fetchGenresAndWishlist = async () => {
    try {
      const [genreRes, wishRes] = await Promise.all([getGenres(), getWishlist()]);
      setGenres(genreRes.genres || []);
      setWishlist(wishRes || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const fetchMovies = async (pageNum, genreId = selectedGenre, query = searchQuery) => {
    setLoading(true);
    try {
      let res;
      if (query.trim()) {
        res = await searchMovies(query, pageNum);
      } else if (genreId) {
        res = await discoverMovies(genreId, pageNum);
      } else {
        res = await getPopularMovies(pageNum);
      }
      setMovies(res.results || []);
      setTotalPages(res.total_pages ? Math.min(res.total_pages, 500) : 1);
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedGenre(''); // Clear genre filter on custom query search
    setPage(1);
    fetchMovies(1, '', searchQuery);
  };

  const handleGenreChange = (e) => {
    const newGenre = e.target.value;
    setSelectedGenre(newGenre);
    setSearchQuery(''); // Clear search query when picking a genre filter
    setPage(1);
  };

  const handleOpenDetails = async (movieId) => {
    setModalLoading(true);
    try {
      const details = await getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (err) {
      console.error('Failed to load movie details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const toggleWishlist = async (movie) => {
    const isWishlisted = wishlist.some((m) => m.id === movie.id);
    try {
      if (isWishlisted) {
        const updated = await removeFromWishlist(movie.id);
        setWishlist(updated);
      } else {
        const updated = await addToWishlist(movie);
        setWishlist(updated);
      }
    } catch (err) {
      console.error('Wishlist update error:', err);
    }
  };

  // Sort movies locally
  const displayedMovies = (activeTab === 'home' ? movies : wishlist)
    .slice()
    .sort((a, b) => {
      if (sortBy === 'vote_average.desc') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === 'release_date.desc') return new Date(b.release_date || 0) - new Date(a.release_date || 0);
      return (b.popularity || 0) - (a.popularity || 0);
    });

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 2rem', backgroundColor: '#1f1f1f', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveTab('home')}>
          🎬 Movie Discovery
        </h1>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <button 
            style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#3b82f6' : '#aaa', fontSize: '1rem', cursor: 'pointer', fontWeight: activeTab === 'home' ? 'bold' : 'normal', transition: 'color 0.2s' }}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            style={{ background: 'none', border: 'none', color: activeTab === 'wishlist' ? '#3b82f6' : '#aaa', fontSize: '1rem', cursor: 'pointer', fontWeight: activeTab === 'wishlist' ? 'bold' : 'normal', transition: 'color 0.2s' }}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist ({wishlist.length})
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {/* Controls Bar */}
        {activeTab === 'home' && (
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', fontSize: '0.95rem' }}
            />
            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
            
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', fontSize: '0.95rem' }}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', fontSize: '0.95rem' }}
            >
              <option value="popularity.desc">Sort by Popularity</option>
              <option value="vote_average.desc">Sort by Rating</option>
              <option value="release_date.desc">Sort by Release Date</option>
            </select>
          </form>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', fontSize: '1.1rem' }}>Loading movies...</div>
        ) : displayedMovies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', fontSize: '1.1rem' }}>No movies found.</div>
        ) : (
          /* Dynamic Movie Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.5rem' }}>
            {displayedMovies.map((movie) => {
              const isWishlisted = wishlist.some((m) => m.id === movie.id);
              const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image';

              return (
                <div 
                  key={movie.id} 
                  onClick={() => handleOpenDetails(movie.id)}
                  style={{ 
                    backgroundColor: '#1f1f1f', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Floating Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(movie);
                    }}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: isWishlisted ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#fff',
                      fontSize: '1.2rem',
                      zIndex: 5,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {isWishlisted ? '♥' : '♡'}
                  </button>

                  {/* Fixed Poster Aspect Ratio */}
                  <div style={{ width: '100%', aspectRatio: '2/3', overflow: 'hidden', backgroundColor: '#111' }}>
                    <img 
                      src={posterUrl} 
                      alt={movie.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Movie Info */}
                  <div style={{ padding: '0.85rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '0.95rem', 
                      fontWeight: '600', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {movie.title}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                      <span style={{ color: '#888', fontSize: '0.8rem' }}>
                        {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {activeTab === 'home' && !loading && movies.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: page <= 1 ? '#333' : '#2563eb',
                color: page <= 1 ? '#777' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              Previous
            </button>

            <span style={{ color: '#ccc', fontWeight: 'bold' }}>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: page >= totalPages ? '#333' : '#2563eb',
                color: page >= totalPages ? '#777' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {(selectedMovie || modalLoading) && (
        <div 
          onClick={() => setSelectedMovie(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#1f1f1f', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid #333' }}
          >
            <button 
              onClick={() => setSelectedMovie(null)}
              style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}
            >
              ✕
            </button>

            {modalLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>Loading Details...</div>
            ) : selectedMovie && (
              <div>
                {selectedMovie.backdrop_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`} 
                    alt={selectedMovie.title} 
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ margin: '0 0 0.5rem 0' }}>{selectedMovie.title}</h2>
                  <div style={{ display: 'flex', gap: '1rem', color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <span>⭐ {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}</span>
                    <span>📅 {selectedMovie.release_date || 'N/A'}</span>
                    {selectedMovie.genres && <span>🎭 {selectedMovie.genres.map(g => g.name).join(', ')}</span>}
                  </div>
                  
                  <p style={{ lineHeight: '1.6', color: '#ddd' }}>
                    {selectedMovie.overview && selectedMovie.overview.trim().length > 0 
                      ? selectedMovie.overview 
                      : 'No description available for this title.'}
                  </p>
                  
                  <button
                    onClick={() => toggleWishlist(selectedMovie)}
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: wishlist.some(m => m.id === selectedMovie.id) ? '#dc2626' : '#2563eb',
                      color: '#fff',
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    {wishlist.some(m => m.id === selectedMovie.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}   