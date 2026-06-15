const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/', (req, res) => {
  const { search, category } = req.query;
  let products = productService.getAllProducts();
  if (search) products = productService.searchProducts(search);
  if (category) products = productService.filterByCategory(category);
  res.json({ products });
});

router.get('/:id', (req, res) => {
  const product = productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', (req, res) => {
  try {
    const product = productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
