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

// CORS: allow a comma-separated list of origins via FRONTEND_URL env var
const rawOrigins = (process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // origin === undefined for server-to-server requests (curl/postman), allow those
    if (!origin) return callback(null, true);

    // allow localhost for local testing
    if (origin.includes('localhost')) return callback(null, true);

    // if no FRONTEND_URL specified -> allow all (dev). Remove this in prod if you want strictness.
    if (rawOrigins.length === 0 || rawOrigins.includes('*')) return callback(null, true);

    if (rawOrigins.includes(origin)) return callback(null, true);

    console.warn('CORS Not Allowed for origin:', origin);
    return callback(new Error('CORS Not Allowed'));
  },
  credentials: true, // set true if client sends cookies/withCredentials
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With']
};

app.use(require('cors')(corsOptions));
app.options('*', require('cors')(corsOptions)); // preflight


app.use('/api/auth', require('./routes/auth'));
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
