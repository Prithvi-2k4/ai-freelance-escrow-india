// backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const proposalRoutes = require('./routes/proposals');

const app = express();

// --- CORS setup ---
// Accept a comma-separated list in FRONTEND_URL env var, e.g:
// FRONTEND_URL="http://localhost:3000,https://worklink-070f.onrender.com,https://your-vercel.netlify.app"
const raw = process.env.FRONTEND_URL || '';
const allowedOrigins = raw
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// helper to check origin and allow dynamically
const corsOptions = {
  origin: function (origin, callback) {
    // browser sends `origin` string for cross-origin requests; for tools like curl origin may be undefined
    if (!origin) {
      // allow non-browser requests (curl/postman) — change to `callback(new Error('Not allowed'))` to block
      return callback(null, true);
    }
    // if wildcard set or empty allowedOrigins -> allow all (only for dev; be careful)
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('CORS Not Allowed for origin:', origin);
    return callback(new Error('CORS Not Allowed'));
  },
  // if you need cookies / auth across origins, set credentials: true and make sure you do not use '*' origin
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
};

app.use(cors(corsOptions));

// optional: allow pre-flight for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);

// Optional: serve frontend build if you have a single repo deploy (set SERVE_FRONTEND=true)
if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('MongoDB connected');
      console.log('Server running', PORT);
      console.log('Allowed CORS origins:', allowedOrigins.length ? allowedOrigins : 'ALL (no FRONTEND_URL set)');
    });
  })
  .catch((err) => {
    console.error('Failed to connect DB', err.message || err);
    process.exit(1);
  });

module.exports = app;
