const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/post/:postId', authenticateToken, (req, res) => {
  const comments = db.prepare(`
    SELECT c.*, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as likesCount,
      (SELECT COUNT(*) FROM likes WHERE comment_id = c.id AND user_id = ?) as likedByMe
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(req.user.id, req.params.postId);

  res.json(comments);
});

router.post('/', authenticateToken, (req, res) => {
  const { post_id, content } = req.body;
  if (!post_id || !content) return res.status(400).json({ error: 'Post ID and content are required' });

  const result = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)').run(post_id, req.user.id, content);
  const comment = db.prepare(`
    SELECT c.*, u.username, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(comment);
});

router.delete('/:id', authenticateToken, (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ message: 'Comment deleted' });
});

module.exports = router;
