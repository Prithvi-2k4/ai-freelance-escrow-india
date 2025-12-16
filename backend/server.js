require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

// middleware
app.use(cors());
app.use(express.json()); // VERY IMPORTANT

// routes
app.use('/api/auth', authRoutes);

// db + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running')
    );
  })
  .catch(err => console.error(err));
