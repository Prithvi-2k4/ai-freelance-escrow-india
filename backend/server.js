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

const notificationsRoutes = require('./routes/notifications'); // add near other routes
app.use('/api/notifications', notificationsRoutes);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Backwards-compat: if FRONTEND_URL is set, add it too
if (process.env.FRONTEND_URL && !ALLOWED_ORIGINS.includes(process.env.FRONTEND_URL)) {
  ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or CLI access (no origin)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.warn("[CORS] Blocked:", origin, "| Allowed:", ALLOWED_ORIGINS);
      return callback(new Error("CORS Not Allowed"));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);


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
      console.log("MongoDB connected");
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB", err.message || err);
    process.exit(1);
  });

module.exports = app;
