require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const knexConfig = require('./db/knexfile').development;
const Knex = require('knex');
const knex = Knex(knexConfig);
const authRoutes = require('./routes/auth')(knex);
const apiRoutes = require('./routes/api')(knex);
const { authMiddleware } = require('./utils/auth');

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, apiRoutes);

// Serve client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  // ensure migrations
  try {
    await knex.migrate.latest();
  } catch (err) {
    console.warn('Migration warn:', err.message);
  }
});