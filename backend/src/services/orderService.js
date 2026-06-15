const { v4: uuidv4 } = require('uuid');
const { calculateTotal } = require('../services/cartService');

let orders = [];

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const createOrder = (userId, cart, shippingAddress) => {
  if (!userId) throw new Error('Usuario requerido');
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('El carrito está vacío');
  }
  if (!shippingAddress || !shippingAddress.city) {
    throw new Error('Dirección de envío requerida');
  }

  const total = calculateTotal(cart);
  const order = {
    id: uuidv4(),
    userId,
    items: [...cart.items],
    total,
    shippingAddress,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  return order;
};

const getOrdersByUser = (userId) => {
  return orders.filter(o => o.userId === userId);
};

const getOrderById = (orderId) => {
  return orders.find(o => o.id === orderId) || null;
};

const updateOrderStatus = (orderId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Estado inválido. Válidos: ${VALID_STATUSES.join(', ')}`);
  }
  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Orden no encontrada');
  order.status = status;
  return order;
};

const applyShippingCost = (total, city) => {
  if (total <= 0) throw new Error('Total inválido');
  const localCities = ['cali', 'bogotá', 'medellín'];
  const isLocal = localCities.includes(city.toLowerCase());
  const shipping = isLocal ? 5000 : 12000;
  return { subtotal: total, shipping, grandTotal: total + shipping };
};

const _resetOrders = () => {
  orders = [];
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  applyShippingCost,
  _resetOrders,
};
