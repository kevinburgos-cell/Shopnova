const cartService = require('../src/services/cartService');

const mockProduct = { id: 'p1', name: 'Camiseta', price: 25000, stock: 10 };
const mockProduct2 = { id: 'p2', name: 'Zapatos', price: 120000, stock: 5 };

describe('CartService - getCart', () => {
  test('debe crear carrito vacío para usuario nuevo', () => {
    const cart = cartService.getCart('user-new-1');
    expect(cart.items).toHaveLength(0);
    expect(cart.userId).toBe('user-new-1');
  });

  test('debe retornar el mismo carrito en llamadas sucesivas', () => {
    const cart1 = cartService.getCart('user-persist');
    const cart2 = cartService.getCart('user-persist');
    expect(cart1).toBe(cart2);
  });
});

describe('CartService - addItem', () => {
  test('debe agregar un ítem al carrito', () => {
    const cart = cartService.addItem('user-add1', mockProduct, 1);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe('p1');
    expect(cart.items[0].quantity).toBe(1);
  });

  test('debe sumar cantidad si el producto ya está en el carrito', () => {
    cartService.addItem('user-add2', mockProduct, 2);
    const cart = cartService.addItem('user-add2', mockProduct, 3);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  test('debe agregar múltiples productos distintos', () => {
    cartService.addItem('user-multi', mockProduct, 1);
    const cart = cartService.addItem('user-multi', mockProduct2, 1);
    expect(cart.items).toHaveLength(2);
  });

  test('debe lanzar error si la cantidad es 0', () => {
    expect(() => cartService.addItem('user-err1', mockProduct, 0)).toThrow();
  });

  test('debe lanzar error si la cantidad es negativa', () => {
    expect(() => cartService.addItem('user-err2', mockProduct, -1)).toThrow();
  });

  test('debe lanzar error si stock insuficiente', () => {
    expect(() => cartService.addItem('user-err3', mockProduct, 100)).toThrow('Stock insuficiente');
  });

  test('debe lanzar error si producto es inválido', () => {
    expect(() => cartService.addItem('user-err4', null, 1)).toThrow();
  });
});

describe('CartService - removeItem', () => {
  test('debe eliminar un ítem del carrito', () => {
    cartService.addItem('user-rem1', mockProduct, 1);
    const cart = cartService.removeItem('user-rem1', 'p1');
    expect(cart.items).toHaveLength(0);
  });

  test('debe lanzar error si el ítem no existe', () => {
    expect(() => cartService.removeItem('user-rem2', 'p-noexiste')).toThrow('Ítem no encontrado');
  });
});

describe('CartService - updateQuantity', () => {
  test('debe actualizar la cantidad de un ítem', () => {
    cartService.addItem('user-upd1', mockProduct, 1);
    const cart = cartService.updateQuantity('user-upd1', 'p1', 5);
    expect(cart.items[0].quantity).toBe(5);
  });

  test('debe lanzar error si cantidad es 0', () => {
    cartService.addItem('user-upd2', mockProduct, 1);
    expect(() => cartService.updateQuantity('user-upd2', 'p1', 0)).toThrow();
  });

  test('debe lanzar error si el ítem no existe', () => {
    expect(() => cartService.updateQuantity('user-upd3', 'p-noexiste', 1)).toThrow();
  });
});

describe('CartService - calculateTotal', () => {
  test('debe calcular el total correctamente', () => {
    const cart = cartService.getCart('user-total1');
    cart.items = [
      { productId: 'p1', price: 25000, quantity: 2 },
      { productId: 'p2', price: 120000, quantity: 1 },
    ];
    expect(cartService.calculateTotal(cart)).toBe(170000);
  });

  test('debe retornar 0 para carrito vacío', () => {
    const cart = cartService.getCart('user-total2');
    expect(cartService.calculateTotal(cart)).toBe(0);
  });

  test('debe retornar 0 si el carrito es null', () => {
    expect(cartService.calculateTotal(null)).toBe(0);
  });
});

describe('CartService - calculateTotalWithDiscount', () => {
  test('debe aplicar descuento del 10%', () => {
    const cart = { items: [{ price: 100000, quantity: 1 }] };
    expect(cartService.calculateTotalWithDiscount(cart, 10)).toBe(90000);
  });

  test('debe retornar el total sin descuento si es 0%', () => {
    const cart = { items: [{ price: 50000, quantity: 2 }] };
    expect(cartService.calculateTotalWithDiscount(cart, 0)).toBe(100000);
  });

  test('debe lanzar error si descuento es mayor a 100', () => {
    const cart = { items: [{ price: 50000, quantity: 1 }] };
    expect(() => cartService.calculateTotalWithDiscount(cart, 110)).toThrow();
  });

  test('debe lanzar error si descuento es negativo', () => {
    const cart = { items: [{ price: 50000, quantity: 1 }] };
    expect(() => cartService.calculateTotalWithDiscount(cart, -5)).toThrow();
  });
});

describe('CartService - clearCart', () => {
  test('debe vaciar el carrito', () => {
    cartService.addItem('user-clear1', mockProduct, 3);
    const cart = cartService.clearCart('user-clear1');
    expect(cart.items).toHaveLength(0);
  });
});

describe('CartService - getItemCount', () => {
  test('debe contar el total de ítems', () => {
    const cart = { items: [{ quantity: 2 }, { quantity: 3 }] };
    expect(cartService.getItemCount(cart)).toBe(5);
  });

  test('debe retornar 0 para carrito vacío', () => {
    expect(cartService.getItemCount({ items: [] })).toBe(0);
  });

  test('debe retornar 0 si cart es null', () => {
    expect(cartService.getItemCount(null)).toBe(0);
  });
});
