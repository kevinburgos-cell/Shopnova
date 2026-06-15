const orderService = require('../src/services/orderService');

beforeEach(() => {
  orderService._resetOrders();
});

const mockCart = {
  userId: 'user1',
  items: [
    { productId: 'p1', name: 'Camiseta', price: 25000, quantity: 2 },
    { productId: 'p2', name: 'Zapatos', price: 120000, quantity: 1 },
  ],
};

const mockAddress = { street: 'Calle 5 #10-20', city: 'Cali', zip: '760001' };

describe('OrderService - createOrder', () => {
  test('debe crear una orden correctamente', () => {
    const order = orderService.createOrder('user1', mockCart, mockAddress);
    expect(order).toHaveProperty('id');
    expect(order.userId).toBe('user1');
    expect(order.status).toBe('pending');
    expect(order.total).toBe(170000);
  });

  test('debe calcular el total correcto', () => {
    const order = orderService.createOrder('user1', mockCart, mockAddress);
    expect(order.total).toBe(170000);
  });

  test('debe lanzar error si el carrito está vacío', () => {
    const emptyCart = { userId: 'user1', items: [] };
    expect(() => orderService.createOrder('user1', emptyCart, mockAddress)).toThrow('vacío');
  });

  test('debe lanzar error si no hay userId', () => {
    expect(() => orderService.createOrder(null, mockCart, mockAddress)).toThrow('Usuario requerido');
  });

  test('debe lanzar error si falta dirección', () => {
    expect(() => orderService.createOrder('user1', mockCart, null)).toThrow('Dirección');
  });

  test('debe lanzar error si la dirección no tiene ciudad', () => {
    expect(() => orderService.createOrder('user1', mockCart, { street: 'Calle 5' })).toThrow('Dirección');
  });
});

describe('OrderService - getOrdersByUser', () => {
  test('debe retornar las órdenes del usuario', () => {
    orderService.createOrder('user1', mockCart, mockAddress);
    orderService.createOrder('user1', mockCart, mockAddress);
    const orders = orderService.getOrdersByUser('user1');
    expect(orders).toHaveLength(2);
  });

  test('debe retornar arreglo vacío si no tiene órdenes', () => {
    const orders = orderService.getOrdersByUser('user-sin-ordenes');
    expect(orders).toHaveLength(0);
  });
});

describe('OrderService - getOrderById', () => {
  test('debe retornar la orden por id', () => {
    const created = orderService.createOrder('user1', mockCart, mockAddress);
    const found = orderService.getOrderById(created.id);
    expect(found.id).toBe(created.id);
  });

  test('debe retornar null si no existe', () => {
    expect(orderService.getOrderById('id-falso')).toBeNull();
  });
});

describe('OrderService - updateOrderStatus', () => {
  test('debe actualizar el estado a confirmed', () => {
    const order = orderService.createOrder('user1', mockCart, mockAddress);
    const updated = orderService.updateOrderStatus(order.id, 'confirmed');
    expect(updated.status).toBe('confirmed');
  });

  test('debe actualizar el estado a shipped', () => {
    const order = orderService.createOrder('user1', mockCart, mockAddress);
    const updated = orderService.updateOrderStatus(order.id, 'shipped');
    expect(updated.status).toBe('shipped');
  });

  test('debe lanzar error con estado inválido', () => {
    const order = orderService.createOrder('user1', mockCart, mockAddress);
    expect(() => orderService.updateOrderStatus(order.id, 'volando')).toThrow('Estado inválido');
  });

  test('debe lanzar error si la orden no existe', () => {
    expect(() => orderService.updateOrderStatus('id-no-existe', 'confirmed')).toThrow('Orden no encontrada');
  });
});

describe('OrderService - applyShippingCost', () => {
  test('debe aplicar envío local para Cali', () => {
    const result = orderService.applyShippingCost(100000, 'Cali');
    expect(result.shipping).toBe(5000);
    expect(result.grandTotal).toBe(105000);
  });

  test('debe aplicar envío nacional para ciudad lejana', () => {
    const result = orderService.applyShippingCost(100000, 'Pasto');
    expect(result.shipping).toBe(12000);
    expect(result.grandTotal).toBe(112000);
  });

  test('debe lanzar error si el total es 0', () => {
    expect(() => orderService.applyShippingCost(0, 'Cali')).toThrow('Total inválido');
  });

  test('debe retornar subtotal correcto', () => {
    const result = orderService.applyShippingCost(75000, 'Bogotá');
    expect(result.subtotal).toBe(75000);
  });
});
