require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const proposalRoutes = require('./routes/proposals');
const notificationRoutes = require('./routes/notifications');
const escrowRoutes = require('./routes/api/escrow');

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/escrow', escrowRoutes);


// server start
connectDB().then(() => {
  app.listen(process.env.PORT || 5000);
});
