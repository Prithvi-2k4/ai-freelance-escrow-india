require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const proposalRoutes = require('./routes/proposals');
const notifRoutes = require('./routes/notifications');

const app = express();
app.use(express.json());

// Flexible CORS: allow FRONTEND_URLs or allow all in dev
const allowed = (process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server or curl
    if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    // allow localhost during local dev
    if (origin.includes('localhost')) return cb(null, true);
    console.log('CORS Not Allowed for origin:', origin);
    cb(new Error('CORS Not Allowed'));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// API routes (namespace all with /api)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notifications', notifRoutes);

// Optional: serve frontend build when SERVE_FRONTEND=true
if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('MongoDB connected');
      console.log('Server running', PORT);
    });
  })
  .catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });

module.exports = app;
