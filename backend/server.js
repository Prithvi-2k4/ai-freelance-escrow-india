// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// routers
const jobsRouter = require('./routes/jobs');
let notificationsRouter;
try {
  notificationsRouter = require('./routes/notifications');
} catch (e) {
  console.warn('No notifications router found:', e.message);
  notificationsRouter = null;
}

// mount routers (both /api/... and short paths)
app.use('/api/jobs', jobsRouter);
app.use('/jobs', jobsRouter);

if (notificationsRouter) {
  app.use('/api/notifications', notificationsRouter);
  app.use('/notifications', notificationsRouter);
}

// health route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
