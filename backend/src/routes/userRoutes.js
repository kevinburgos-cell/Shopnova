const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.register(name, email, password);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
