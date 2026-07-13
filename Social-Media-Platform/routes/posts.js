const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likesCount,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentsCount,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as likedByMe
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT 50
  `).all(req.user.id);

  res.json(posts);
});

router.get('/feed', authenticateToken, (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likesCount,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentsCount,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as likedByMe
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
       OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
    ORDER BY p.created_at DESC
    LIMIT 50
  `).all(req.user.id, req.user.id, req.user.id);

  res.json(posts);
});

router.get('/user/:userId', authenticateToken, (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likesCount,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentsCount,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as likedByMe
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `).all(req.user.id, req.params.userId);

  res.json(posts);
});

router.post('/', authenticateToken, (req, res) => {
  const { content, image } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const result = db.prepare('INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)').run(req.user.id, content, image || '');
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

router.delete('/:id', authenticateToken, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
