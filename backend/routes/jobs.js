// backend/routes/jobs.js
const express = require('express');
const router = express.Router();

router.get('/jobs', async (req, res) => {
  res.json([
    { _id: '1', title: 'Test job #1', description: 'Placeholder' },
    { _id: '2', title: 'Test job #2', description: 'Placeholder' },
  ]);
});

module.exports = router;

// backend/server.js
const express = require('express');
const app = express();
const jobsRouter = require('./routes/jobs');

app.use('/api', jobsRouter); // -> GET /api/jobs

app.listen(process.env.PORT || 3000);
