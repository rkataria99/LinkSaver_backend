# Link Saver — Backend (Node + Express + MongoDB)

This is the backend API for the **Link Saver** app.  
It provides:
- **JWT-based authentication**
- **Bookmark CRUD operations**
- **Drag-and-drop ordering support**
- **AI-powered link summarization** via `summarize.js` (using Jina Reader API to fetch AI-generated summaries of bookmarked links)
- **CORS support** for development and production domains

---

## Tech Stack
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT authentication**
- **CORS**
- **Axios** (for AI summarization requests in `summarize.js`)

---

## Quick Start (Local)

```bash
# 1) Install dependencies
npm install

# 2) Configure environment
cp .env.example .env
# Edit .env and set:
# MONGO_URI=<Your MongoDB Atlas URI>
# JWT_SECRET=<A strong secret key>
# PORT=5000  (optional, defaults to 5000)

# 3) Run (production style)
node index.js

# or for development with auto-reload (if nodemon is installed)
npm run dev

# Server will be available at:
# http://localhost:5000
