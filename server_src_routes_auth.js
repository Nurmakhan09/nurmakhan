const express = require('express');
const bcrypt = require('bcrypt');
const { sign } = require('../utils/auth');

module.exports = function (knex) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing' });
    const existing = await knex('users').where({ username }).orWhere({ email }).first();
    if (existing) return res.status(409).json({ error: 'User exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const [id] = await knex('users').insert({ username, email, password_hash });
    const user = await knex('users').where({ id }).first();
    const token = sign(user);
    res.json({ token, user: { id: user.id, username: user.username, settings: user.settings } });
  });

  router.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) return res.status(400).json({ error: 'Missing' });
    const user = await knex('users').where((qb) => {
      qb.where({ username: usernameOrEmail }).orWhere({ email: usernameOrEmail });
    }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = sign(user);
    res.json({ token, user: { id: user.id, username: user.username, settings: user.settings } });
  });

  return router;
};