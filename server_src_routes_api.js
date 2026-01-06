const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // Get profile
  router.get('/profile', async (req, res) => {
    const user = await knex('users').where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user.id, username: user.username, settings: user.settings });
  });

  // Settings update
  router.put('/settings', async (req, res) => {
    const { settings } = req.body;
    await knex('users').where({ id: req.user.id }).update({ settings });
    res.json({ ok: true });
  });

  // Shortcuts CRUD
  router.get('/shortcuts', async (req, res) => {
    const list = await knex('shortcuts').where({ user_id: req.user.id }).orderBy('order_index', 'asc');
    res.json(list);
  });

  router.post('/shortcuts', async (req, res) => {
    const { title, url } = req.body;
    const [id] = await knex('shortcuts').insert({ user_id: req.user.id, title, url });
    const item = await knex('shortcuts').where({ id }).first();
    res.json(item);
  });

  router.delete('/shortcuts/:id', async (req, res) => {
    await knex('shortcuts').where({ id: req.params.id, user_id: req.user.id }).del();
    res.json({ ok: true });
  });

  router.put('/shortcuts/:id', async (req, res) => {
    const { title, url } = req.body;
    await knex('shortcuts').where({ id: req.params.id, user_id: req.user.id }).update({ title, url });
    const item = await knex('shortcuts').where({ id: req.params.id }).first();
    res.json(item);
  });

  // Stats
  router.post('/stats/session', async (req, res) => {
    const { seconds, pomodoroSeconds } = req.body;
    await knex('stats').insert({ user_id: req.user.id, session_seconds: seconds, pomodoro_seconds: pomodoroSeconds });
    res.json({ ok: true });
  });

  router.get('/stats', async (req, res) => {
    const rows = await knex('stats').where({ user_id: req.user.id }).orderBy('created_at', 'desc').limit(50);
    res.json(rows);
  });

  // Drawings
  router.get('/drawings', async (req, res) => {
    const rows = await knex('drawings').where({ user_id: req.user.id }).orderBy('updated_at', 'desc').limit(10);
    res.json(rows);
  });

  router.post('/drawings', async (req, res) => {
    const { dataUrl } = req.body;
    const [id] = await knex('drawings').insert({ user_id: req.user.id, data_url: dataUrl });
    const item = await knex('drawings').where({ id }).first();
    res.json(item);
  });

  // Essays
  router.get('/essays', async (req, res) => {
    const rows = await knex('essays').where({ user_id: req.user.id }).orderBy('updated_at', 'desc');
    res.json(rows);
  });

  router.post('/essays', async (req, res) => {
    const { title, content } = req.body;
    const [id] = await knex('essays').insert({ user_id: req.user.id, title, content });
    const item = await knex('essays').where({ id }).first();
    res.json(item);
  });

  router.put('/essays/:id', async (req, res) => {
    const { title, content } = req.body;
    await knex('essays').where({ id: req.params.id, user_id: req.user.id }).update({ title, content, updated_at: knex.fn.now() });
    const item = await knex('essays').where({ id: req.params.id }).first();
    res.json(item);
  });

  // Music search stub (connect to provider externally)
  router.get('/music/search', async (req, res) => {
    const q = req.query.q || '';
    // In production, integrate with e.g. Spotify API. For now return mocked data.
    const sample = [
      { id: 'm1', title: 'Deep Focus — Beat 1', artist: 'Study Lab', url: 'https://example.com/track/1' },
      { id: 'm2', title: 'Ambient Focus — 2', artist: 'Calm Studio', url: 'https://example.com/track/2' }
    ];
    const filtered = sample.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.artist.toLowerCase().includes(q.toLowerCase()));
    res.json(filtered);
  });

  return router;
};