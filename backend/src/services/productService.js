const { v4: uuidv4 } = require('uuid');

let products = [
  { id: '1', name: 'Camiseta Básica', price: 25000, stock: 50, category: 'ropa', description: 'Camiseta de algodón 100%', rating: 4.5 },
  { id: '2', name: 'Zapatos Deportivos', price: 120000, stock: 30, category: 'calzado', description: 'Zapatos para running', rating: 4.8 },
  { id: '3', name: 'Mochila Urbana', price: 75000, stock: 20, category: 'accesorios', description: 'Mochila resistente al agua', rating: 4.2 },
  { id: '4', name: 'Gorra Estampada', price: 35000, stock: 100, category: 'accesorios', description: 'Gorra ajustable', rating: 4.0 },
  { id: '5', name: 'Pantalón Cargo', price: 85000, stock: 40, category: 'ropa', description: 'Pantalón con múltiples bolsillos', rating: 4.3 },
];

const getAllProducts = () => {
  return products;
};

const getProductById = (id) => {
  const product = products.find(p => p.id === id);
  if (!product) return null;
  return product;
};

const searchProducts = (query) => {
  if (!query || query.trim() === '') return products;
  const q = query.toLowerCase().trim();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
};

const filterByCategory = (category) => {
  if (!category) return products;
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

const createProduct = (data) => {
  if (!data.name || !data.price || data.price <= 0) {
    throw new Error('Nombre y precio válido son requeridos');
  }
  const newProduct = {
    id: uuidv4(),
    name: data.name,
    price: data.price,
    stock: data.stock || 0,
    category: data.category || 'general',
    description: data.description || '',
    rating: 0,
  };
  products.push(newProduct);
  return newProduct;
};

const updateStock = (id, quantity) => {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Producto no encontrado');
  if (product.stock < quantity) throw new Error('Stock insuficiente');
  product.stock -= quantity;
  return product;
};

const isInStock = (id) => {
  const product = products.find(p => p.id === id);
  if (!product) return false;
  return product.stock > 0;
};

const _resetProducts = () => {
  products = [
    { id: '1', name: 'Camiseta Básica', price: 25000, stock: 50, category: 'ropa', description: 'Camiseta de algodón 100%', rating: 4.5 },
    { id: '2', name: 'Zapatos Deportivos', price: 120000, stock: 30, category: 'calzado', description: 'Zapatos para running', rating: 4.8 },
    { id: '3', name: 'Mochila Urbana', price: 75000, stock: 20, category: 'accesorios', description: 'Mochila resistente al agua', rating: 4.2 },
    { id: '4', name: 'Gorra Estampada', price: 35000, stock: 100, category: 'accesorios', description: 'Gorra ajustable', rating: 4.0 },
    { id: '5', name: 'Pantalón Cargo', price: 85000, stock: 40, category: 'ropa', description: 'Pantalón con múltiples bolsillos', rating: 4.3 },
  ];
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  filterByCategory,
  createProduct,
  updateStock,
  isInStock,
  _resetProducts,
};
