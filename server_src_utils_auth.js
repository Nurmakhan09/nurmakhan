const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'dev-secret';

function sign(user) {
  return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No auth' });
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid auth' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.user = payload;
  next();
}

module.exports = { sign, verifyToken, authMiddleware };