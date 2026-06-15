const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');

router.get('/:userId', (req, res) => {
  const cart = cartService.getCart(req.params.userId);
  const total = cartService.calculateTotal(cart);
  res.json({ cart, total });
});

router.post('/:userId/items', (req, res) => {
  try {
    const { product, quantity } = req.body;
    const cart = cartService.addItem(req.params.userId, product, quantity);
    res.status(201).json({ cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:userId/items/:productId', (req, res) => {
  try {
    const cart = cartService.removeItem(req.params.userId, req.params.productId);
    res.json({ cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
