const carts = {};

const getCart = (userId) => {
  if (!carts[userId]) {
    carts[userId] = { userId, items: [], createdAt: new Date().toISOString() };
  }
  return carts[userId];
};

const addItem = (userId, product, quantity = 1) => {
  if (!product || !product.id) throw new Error('Producto inválido');
  if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
  if (product.stock !== undefined && product.stock < quantity) {
    throw new Error('Stock insuficiente');
  }

  const cart = getCart(userId);
  const existing = cart.items.find(i => i.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }
  return cart;
};

const removeItem = (userId, productId) => {
  const cart = getCart(userId);
  const index = cart.items.findIndex(i => i.productId === productId);
  if (index === -1) throw new Error('Ítem no encontrado en el carrito');
  cart.items.splice(index, 1);
  return cart;
};

const updateQuantity = (userId, productId, quantity) => {
  if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
  const cart = getCart(userId);
  const item = cart.items.find(i => i.productId === productId);
  if (!item) throw new Error('Ítem no encontrado en el carrito');
  item.quantity = quantity;
  return cart;
};

const calculateTotal = (cart) => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const calculateTotalWithDiscount = (cart, discountPercent = 0) => {
  const total = calculateTotal(cart);
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Descuento debe estar entre 0 y 100');
  }
  const discount = total * (discountPercent / 100);
  return parseFloat((total - discount).toFixed(2));
};

const clearCart = (userId) => {
  if (carts[userId]) {
    carts[userId].items = [];
  }
  return getCart(userId);
};

const getItemCount = (cart) => {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

module.exports = {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
  calculateTotal,
  calculateTotalWithDiscount,
  clearCart,
  getItemCount,
};
