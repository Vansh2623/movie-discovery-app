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
|   |   ├── Home.jsx/        # Main movie discovery view page
|   |   ├── Wishlist.jsx/    # Saved wishlist movies view page
│   ├── components/          # Reusable UI sub-components
|   |    ├── MovieCard.jsx   # Individual movie card item component
|   |    ├── MovieDetailsModal.jsx  # Detailed view modal popup component
|   |    ├── Navbar.jsx      # Top navigation header component
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

```

### 🏗️ Technical Decisions & Architectural Highlights

**Backend Abstraction Layer:** The frontend client never communicates directly with TMDB. All calls route through our custom Node.js/Express API to protect secret API keys and transform raw third-party payloads into clean client data.

**In-Memory Caching:** Implemented an in-memory cache map (Map) on the backend with Time-To-Live (TTL) expiration. This minimizes repeated calls to TMDB, respects API rate limits, and improves client response speeds.

**Persistent Wishlist Storage:** Wishlist state is synchronized with a server-side JSON file system (wishlist.json), ensuring wishlist data persists even when closing/reopening the browser or restarting the backend server.

**Resilient Fallbacks:** Safe fallbacks are provided for titles with missing poster images, missing descriptions, or broken API requests.

**Server-Side Pagination and Filtering:** Search queries and genre discovery use server-side pagination, enabling smooth exploration across large result sets without overloading client memory.


### 🤖 AI Collaboration & Transparency Statement

This project was built with the assistance of **Google Gemini**, which served as an interactive coding partner for rapid setup, debugging, and layout optimization.

* **AI-Assisted Tasks**:
  * **Boilerplate Code Generation**: Generating foundational code snippets for initial Express.js server routes, React component structures, and standard fetch API utility functions.
  * **Network & Middleware Debugging**: Troubleshooting Express.js routing, CORS configurations, 404 handler errors, and missing `/api` endpoint prefixes.
  * **Cross-Device Host Resolution**: Formulating dynamic `window.location.hostname` API request patterns to enable local Wi-Fi access on mobile devices.

* **Developer Ownership & Core Implementation**:
  * **Architecture & State**: Designed the overall application architecture, React state flow, and component hierarchy.
  * **Integration & Persistence**: Implemented backend RESTful endpoints, TMDB API data fetching logic, and local wishlist operations.
  * **Responsive Layout Optimization**: Adjusting CSS flexbox and grid rules to correct overflowing cards, text collisions, and mobile viewport issues.
  * **Repository & Deployment**: Managed project file structure, Git version control setup, `.gitignore` rules, and GitHub repository deployment independently.
  * **Testing & Quality Control**: Independently verified, debugged, and validated all functionality across both desktop browsers and physical mobile devices.

### 🔮 Known Limitations & Future Enhancements
**Database Upgrade:** Upgrade file system JSON storage to SQLite or MongoDB to support multi-user wishlist profiles.

**Trailer Integration:** Add YouTube trailer previews inside the modal view via TMDB's video endpoint.

**Skeleton Loading Screens:** Upgrade plain text loading indicators to animated skeleton grid loaders.
