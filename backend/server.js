// backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs'); // ensure this path matches the file above
const proposalRoutes = require('./routes/proposals');

const app = express();

const raw = process.env.FRONTEND_URL || '';
const allowedOrigins = raw.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('CORS Not Allowed for origin:', origin);
    return callback(new Error('CORS Not Allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // router.get('/') -> GET /api/jobs
app.use('/api/proposals', proposalRoutes);

// Optional: serve frontend build if needed
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
