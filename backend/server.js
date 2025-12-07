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

// build a whitelist from FRONTEND_URL env (comma separated)
const raw = process.env.FRONTEND_URL || '';
const whitelist = raw.split(',').map(s => s.trim()).filter(Boolean);

// simple debug log so you can see what origins are allowed in logs
console.log('CORS whitelist:', whitelist.length ? whitelist : '[none - allow all]');

// CORS options: if whitelist is empty => allow all (*) - useful for quick dev
const corsOptions = (req, callback) => {
  const origin = req.header('Origin');
  if (!origin) {
    // non-browser request (curl, server-side) — allow it
    return callback(null, { origin: true });
  }

  if (whitelist.length === 0) {
    // no whitelist => allow all (dev)
    return callback(null, { origin: true });
  }

  // allow exact match OR allow if origin is in whitelist
  if (whitelist.includes(origin)) {
    return callback(null, { origin: true, credentials: true });
  }

  // Not allowed
  const msg = `CORS Not Allowed for origin: ${origin}`;
  return callback(new Error(msg), { origin: false });
};

// attach CORS middleware (use function so preflight is checked)
app.use((req, res, next) => {
  cors(corsOptions)(req, res, err => {
    if (err) {
      // optional: log and respond for preflight/blocked origins
      console.warn(err.message);
      return res.status(403).json({ msg: 'CORS Not Allowed', detail: err.message });
    }
    next();
  });
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);

// Optional: serve frontend build if you have a single repo deploy
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
    });
  })
  .catch((err) => {
    console.error('Failed to connect DB', err.message || err);
    process.exit(1);
  });

module.exports = app;
