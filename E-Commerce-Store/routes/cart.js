const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const items = db.prepare(`
    SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url, p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.session.userId);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items, total });
});

router.post('/add', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.session.userId, product_id);
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
  } else {
    if (quantity > product.stock) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }
    db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.session.userId, product_id, quantity);
  }
  res.json({ message: 'Item added to cart' });
});

router.put('/update/:id', (req, res) => {
  const { quantity } = req.body;
  const item = db.prepare('SELECT ci.*, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ? AND ci.user_id = ?').get(req.params.id, req.session.userId);
  if (!item) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  if (quantity > item.stock) {
    return res.status(400).json({ error: 'Not enough stock available' });
  }
  if (quantity <= 0) {
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  }
  res.json({ message: 'Cart updated' });
});

router.delete('/remove/:id', (req, res) => {
  const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Cart item not found' });
  }
  res.json({ message: 'Item removed from cart' });
});

router.delete('/clear', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.session.userId);
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
