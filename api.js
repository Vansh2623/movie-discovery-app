// Automatically uses 'localhost' on PC and '192.168.1.111' on mobile
const host = window.location.hostname;
const API_BASE_URL = `http://${host}:5000/api`;

const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server status ${res.status}: ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Request Error [${endpoint}]:`, err.message);
    throw err;
  }
};

export const getPopularMovies = (page = 1) => apiRequest(`/movies/popular?page=${page}`);
export const searchMovies = (query, page = 1) => apiRequest(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
export const discoverMovies = (genreId = '', page = 1) => apiRequest(`/movies/discover?genre=${genreId}&page=${page}`);
export const getGenres = () => apiRequest('/movies/genres');
export const getMovieDetails = (id) => apiRequest(`/movies/${id}`);
export const getWishlist = () => apiRequest('/wishlist');
export const addToWishlist = (movie) => apiRequest('/wishlist', { method: 'POST', body: JSON.stringify(movie) });
export const removeFromWishlist = (id) => apiRequest(`/wishlist/${id}`, { method: 'DELETE' });