const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.use(cors());
app.use(express.json());

// --- PERSISTENT WISHLIST FILE STORAGE ---
const WISHLIST_FILE = path.join(__dirname, 'wishlist.json');

const readWishlist = () => {
  try {
    if (!fs.existsSync(WISHLIST_FILE)) {
      fs.writeFileSync(WISHLIST_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(WISHLIST_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading wishlist file:', err);
    return [];
  }
};

const writeWishlist = (data) => {
  try {
    fs.writeFileSync(WISHLIST_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing wishlist file:', err);
  }
};

// --- SIMPLE IN-MEMORY API CACHE ---
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

const fetchTMDB = async (endpoint) => {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);

  // Return cached result if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (!TMDB_API_KEY) {
    throw new Error('TMDB API Key missing in environment variables');
  }

  const delimiter = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${delimiter}api_key=${TMDB_API_KEY}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB HTTP Error ${res.status}`);
  }

  const data = await res.json();
  // Save to cache
  cache.set(cacheKey, { timestamp: Date.now(), data });
  return data;
};

// --- API ROUTES ---

// 1. Popular Movies
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchTMDB(`/movie/popular?page=${page}`);
    res.json(data);
  } catch (err) {
    console.error('[Popular Error]:', err.message);
    res.status(500).json({ error: 'Failed to fetch popular movies', results: [], page: 1, total_pages: 1 });
  }
});

// 2. Search Movies
app.get('/api/movies/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.json({ results: [], page: 1, total_pages: 1 });
    const data = await fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
    res.json(data);
  } catch (err) {
    console.error('[Search Error]:', err.message);
    res.status(500).json({ error: 'Search request failed', results: [] });
  }
});

// 3. Discover Movies (Genre + Page)
app.get('/api/movies/discover', async (req, res) => {
  try {
    const { genre, page = 1 } = req.query;
    let endpoint = `/discover/movie?page=${page}`;
    if (genre) endpoint += `&with_genres=${genre}`;
    const data = await fetchTMDB(endpoint);
    res.json(data);
  } catch (err) {
    console.error('[Discover Error]:', err.message);
    res.status(500).json({ error: 'Discover request failed', results: [] });
  }
});

// 4. Genres List
app.get('/api/movies/genres', async (req, res) => {
  try {
    const data = await fetchTMDB('/genre/movie/list');
    res.json(data);
  } catch (err) {
    res.status(500).json({ genres: [] });
  }
});

// 5. Movie Details
app.get('/api/movies/:id', async (req, res) => {
  try {
    const data = await fetchTMDB(`/movie/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load movie details' });
  }
});

// --- PERSISTENT WISHLIST ENDPOINTS ---
app.get('/api/wishlist', (req, res) => {
  res.json(readWishlist());
});

app.post('/api/wishlist', (req, res) => {
  const movie = req.body;
  let wishlist = readWishlist();
  if (!wishlist.some((m) => m.id === movie.id)) {
    wishlist.push(movie);
    writeWishlist(wishlist);
  }
  res.json(wishlist);
});

app.delete('/api/wishlist/:id', (req, res) => {
  const movieId = Number(req.params.id);
  let wishlist = readWishlist();
  wishlist = wishlist.filter((m) => m.id !== movieId);
  writeWishlist(wishlist);
  res.json(wishlist);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});