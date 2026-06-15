const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

router.post('/', (req, res) => {
  try {
    const { userId, cart, shippingAddress } = req.body;
    const order = orderService.createOrder(userId, cart, shippingAddress);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
