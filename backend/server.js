// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const cors = require('cors');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const proposalRoutes = require('./routes/proposals');

const app = express();

const notificationRoutes = require("./routes/notifications");
app.use("/api/notifications", notificationRoutes);


// Basic middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

// Health endpoints (useful for uptime checks)
app.get('/', (req, res) => res.send('AI Freelance Escrow API is running. Use /api/* endpoints.'));
app.get('/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);

// Create HTTP server and attach socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Make io available to routes/services if needed
app.set('io', io);

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (room) => {
    if (room) socket.join(room);
  });

  socket.on('leave', (room) => {
    if (room) socket.leave(room);
  });

  // Generic message relay (persist messages separately if desired)
  socket.on('message', (room, msg) => {
    if (room) io.to(room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start server immediately so Render detects an open port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Connect to DB with retries (non-blocking)
async function startDBWithRetries(retries = 10, delayMs = 5000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await connectDB();
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempt++;
      console.warn(`DB connect attempt ${attempt} failed: ${err.message || err}`);
      if (attempt < retries) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  console.error(`DB connection failed after ${retries} attempts`);
}

startDBWithRetries();

// Graceful shutdown
async function shutdown(signal) {
  try {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    io.close();
    server.close(() => console.log('HTTP server closed'));
    // If your connectDB returns mongoose connection reference, close it:
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed');
    } catch (e) {
      console.warn('Error closing MongoDB connection:', e.message || e);
    }
    process.exit(0);
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
