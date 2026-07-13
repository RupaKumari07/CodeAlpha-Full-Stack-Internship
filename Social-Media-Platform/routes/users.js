const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').get(req.user.id).count;
  const followersCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(req.user.id).count;
  const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(req.user.id).count;

  res.json({ ...user, postCount, followersCount, followingCount });
});

router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, username, bio, avatar, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').get(req.params.id).count;
  const followersCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').get(req.params.id).count;
  const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').get(req.params.id).count;

  res.json({ ...user, postCount, followersCount, followingCount });
});

router.put('/profile', authenticateToken, (req, res) => {
  const { bio, avatar } = req.body;
  db.prepare('UPDATE users SET bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?').run(bio, avatar, req.user.id);
  const user = db.prepare('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

router.get('/search/:query', authenticateToken, (req, res) => {
  const users = db.prepare('SELECT id, username, bio, avatar FROM users WHERE username LIKE ? LIMIT 20').all(`%${req.params.query}%`);


  res.json(users || []);
});

module.exports = router;
