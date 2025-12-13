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

// ===== CORS CONFIG =====
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server (curl/postman)
    if (!origin) return callback(null, true);

    // allow localhost
    if (origin.includes('localhost')) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.options('*', cors());
// =======================

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notifications', notifRoutes);

// Health check
app.get('/api/_ping', (req, res) => res.json({ ok: true }));

// Optional frontend serve
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
      console.log('✅ MongoDB connected');
      console.log('🚀 Server running on port', PORT);
      console.log('🌍 Allowed origins:', allowedOrigins);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  });

module.exports = app;
