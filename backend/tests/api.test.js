const request = require('supertest');
const app = require('../src/app');

describe('API - Health check', () => {
  test('GET /api/health debe responder ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBe('ShopNova');
  });
});

describe('API - Products', () => {
  test('GET /api/products debe retornar lista', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test('GET /api/products?search=camiseta debe filtrar', async () => {
    const res = await request(app).get('/api/products?search=camiseta');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test('GET /api/products/:id debe retornar producto', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  test('GET /api/products/:id con id inválido debe retornar 404', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
  });

  test('POST /api/products debe crear producto', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Nuevo Producto', price: 45000, category: 'test', stock: 5 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Nuevo Producto');
  });

  test('POST /api/products sin precio debe retornar 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Sin precio' });
    expect(res.status).toBe(400);
  });
});

describe('API - Users', () => {
  test('POST /api/users/register debe registrar usuario', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ name: 'Kevin Test', email: `kevin${Date.now()}@test.com`, password: 'pass1234' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('POST /api/users/login con credenciales correctas debe retornar token', async () => {
    const email = `logintest${Date.now()}@test.com`;
    await request(app).post('/api/users/register').send({ name: 'Login User', email, password: 'testpass' });
    const res = await request(app).post('/api/users/login').send({ email, password: 'testpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/users/login con creds incorrectas debe retornar 401', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'noexiste@test.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});

describe('API - Cart', () => {
  test('GET /api/cart/:userId debe retornar carrito', async () => {
    const res = await request(app).get('/api/cart/user-api-test');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cart');
    expect(res.body).toHaveProperty('total');
  });

  test('POST /api/cart/:userId/items debe agregar ítem', async () => {
    const res = await request(app)
      .post('/api/cart/user-api-add/items')
      .send({ product: { id: 'p1', name: 'Test', price: 25000, stock: 10 }, quantity: 1 });
    expect(res.status).toBe(201);
    expect(res.body.cart.items).toHaveLength(1);
  });

  test('DELETE /api/cart/:userId/items/:productId debe eliminar ítem', async () => {
    await request(app)
      .post('/api/cart/user-api-del/items')
      .send({ product: { id: 'p1', name: 'Test', price: 25000, stock: 10 }, quantity: 1 });
    const res = await request(app).delete('/api/cart/user-api-del/items/p1');
    expect(res.status).toBe(200);
    expect(res.body.cart.items).toHaveLength(0);
  });
});

describe('API - 404 y errores', () => {
  test('Ruta inexistente debe retornar 404', async () => {
    const res = await request(app).get('/api/ruta-que-no-existe');
    expect(res.status).toBe(404);
  });
});
