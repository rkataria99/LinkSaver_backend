const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();

// ---- CORS ----
const whitelist = new Set([
  'http://localhost:5173',
  'https://link-saver-frontend-hfcx.vercel.app',
]);

const corsOptions = {
  origin(origin, cb) {
    // allow same-origin / curl / server-to-server (no Origin header)
    if (!origin) return cb(null, true);

    // allow any vercel.app preview deployments
    if (origin.endsWith('.vercel.app')) return cb(null, true);

    // allow exact whitelisted origins
    if (whitelist.has(origin)) return cb(null, true);

    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // set true only if you actually use cookies
};

app.use(cors(corsOptions));
// respond quickly to preflights
app.options('*', cors(corsOptions));
// ----------------

app.use(express.json({ limit: '1mb' }));

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: missing JWT_SECRET in .env (using insecure default for dev)'); // set in Render!
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => {
    console.error(' MongoDB Error:', err.message);
    process.exit(1);
  });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
