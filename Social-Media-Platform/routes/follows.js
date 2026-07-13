const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/:userId', authenticateToken, (req, res) => {
  const targetId = parseInt(req.params.userId);
  if (targetId === req.user.id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(targetId);
  if (!target) return res.status(404).json({ error: 'User not found' });

  const existing = db.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(req.user.id, targetId);
  if (existing) {
    db.prepare('DELETE FROM follows WHERE id = ?').run(existing.id);
    res.json({ following: false });
  } else {
    db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').run(req.user.id, targetId);
    res.json({ following: true });
  }
});

router.get('/status/:userId', authenticateToken, (req, res) => {
  const following = db.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(req.user.id, req.params.userId);
  res.json({ following: !!following });
});

router.get('/followers/:userId', authenticateToken, (req, res) => {
  const followers = db.prepare(`
    SELECT u.id, u.username, u.avatar, u.bio
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = ?
  `).all(req.params.userId);
  res.json(followers);
});

router.get('/following/:userId', authenticateToken, (req, res) => {
  const following = db.prepare(`
    SELECT u.id, u.username, u.avatar, u.bio
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
  `).all(req.params.userId);
  res.json(following);
});

module.exports = router;
