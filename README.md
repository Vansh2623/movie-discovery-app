# 🎬 Movie Discovery Application

A full-stack movie discovery web application built with **React**, **Node.js/Express**, and the **TMDB (The Movie Database) API**. Users can browse popular movies, search titles, filter by genre, sort results, view detailed movie information in a modal, and manage a persistent wishlist.

---

## 📁 Repository Structure

```text
movie-discovery-app/
├── client(frontend)/
│   ├── node_modules/        # Client dependencies (git ignored)
│   ├── assets/              # Static media assets (images, icons, SVGs)
│   ├── pages/               # Top-level view/route components
|       ├── Home.jsx/        # Main movie discovery view page
|       ├── Wishlist.jsx/    # Saved wishlist movies view page
│   ├── components/          # Reusable UI sub-components
|        ├── MovieCard.jsx   # Individual movie card item component
|        ├── MovieDetailsModal.jsx  # Detailed view modal popup component
|        ├── Navbar.jsx      # Top navigation header component
│   ├── services/
│   │   └── api.js           # API request helpers
|   ├── App.css              # Main application component styles
│   ├── App.jsx              # Main React SPA component
│   ├── main.jsx             # React DOM root entry point
|   |── index.css            # Global CSS styling & baseline resets
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies & scripts
│   ├── package-lock.json    # Locked dependency tree
│   └── vite.config.js       # Vite development configuration
├── server/
│   ├── node_modules/        # Server dependencies (git ignored)
│   ├── .env                 # API keys & server port (git ignored)
│   ├── wishlist.json        # Persistent wishlist storage
│   ├── server.js            # Express server, cache & TMDB layer
│   ├── package.json         # Backend dependencies & scripts
│   └── package-lock.json    # Locked dependency tree
└── README.md                # Project documentation & assignment setup
└── .gitignore               # Files to be ignored by github


🏗️ Technical Decisions & Architectural Highlights
Backend Abstraction Layer: The frontend client never communicates directly with TMDB. All calls route through our custom Node.js/Express API to protect secret API keys and transform raw third-party payloads into clean client data.

In-Memory Caching: Implemented an in-memory cache map (Map) on the backend with Time-To-Live (TTL) expiration. This minimizes repeated calls to TMDB, respects API rate limits, and improves client response speeds.

Persistent Wishlist Storage: Wishlist state is synchronized with a server-side JSON file system (wishlist.json), ensuring wishlist data persists even when closing/reopening the browser or restarting the backend server.

Server-Side Pagination & Filtering: Search queries and genre discovery use server-side pagination, enabling smooth exploration across large result sets without overloading client memory.

Resilient Fallbacks: Safe fallbacks are provided for titles with missing poster images, missing descriptions, or broken API requests.

🤖 AI Tool Transparency
AI Assistance: AI tools (Gemini) were used to assist with initial API endpoint design, debugging CORS and Express middleware errors, optimizing CSS layout components, and generating boilerplate markdown documentation.

Developer Ownership: Application architecture, state management, component flow, data persistence, and API request handling were verified, tested, and understood by the author.

🔮 Known Limitations & Future Enhancements
Database Upgrade: Upgrade file system JSON storage to SQLite or MongoDB to support multi-user wishlist profiles.

Trailer Integration: Add YouTube trailer previews inside the modal view via TMDB's video endpoint.

Skeleton Loading Screens: Upgrade plain text loading indicators to animated skeleton grid loaders.