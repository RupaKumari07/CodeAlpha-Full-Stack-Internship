const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/post/:postId', authenticateToken, (req, res) => {
  const existing = db.prepare('SELECT id FROM likes WHERE user_id = ? AND post_id = ?').get(req.user.id, req.params.postId);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE id = ?').run(existing.id);
    res.json({ liked: false });
  } else {
    db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(req.user.id, req.params.postId);
    res.json({ liked: true });
  }
});

router.post('/comment/:commentId', authenticateToken, (req, res) => {
  const existing = db.prepare('SELECT id FROM likes WHERE user_id = ? AND comment_id = ?').get(req.user.id, req.params.commentId);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE id = ?').run(existing.id);
    res.json({ liked: false });
  } else {
    db.prepare('INSERT INTO likes (user_id, comment_id) VALUES (?, ?)').run(req.user.id, req.params.commentId);
    res.json({ liked: true });
  }
});

module.exports = router;
