require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*'
}));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log('🚀 Backend running')
  );
});
