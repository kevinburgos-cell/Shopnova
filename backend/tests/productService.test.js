const productService = require('../src/services/productService');

beforeEach(() => {
  productService._resetProducts();
});

describe('ProductService - getAllProducts', () => {
  test('debe retornar todos los productos', () => {
    const products = productService.getAllProducts();
    expect(products).toHaveLength(5);
  });

  test('todos los productos tienen id, name y price', () => {
    const products = productService.getAllProducts();
    products.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('price');
    });
  });
});

describe('ProductService - getProductById', () => {
  test('debe retornar el producto con id 1', () => {
    const product = productService.getProductById('1');
    expect(product).not.toBeNull();
    expect(product.id).toBe('1');
    expect(product.name).toBe('Camiseta Básica');
  });

  test('debe retornar null si el producto no existe', () => {
    const product = productService.getProductById('999');
    expect(product).toBeNull();
  });
});

describe('ProductService - searchProducts', () => {
  test('debe encontrar productos por nombre', () => {
    const results = productService.searchProducts('camiseta');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('camiseta');
  });

  test('debe encontrar productos por categoría', () => {
    const results = productService.searchProducts('calzado');
    expect(results.length).toBeGreaterThan(0);
  });

  test('debe retornar todos si la búsqueda está vacía', () => {
    const results = productService.searchProducts('');
    expect(results).toHaveLength(5);
  });

  test('debe ser insensible a mayúsculas', () => {
    const results = productService.searchProducts('MOCHILA');
    expect(results.length).toBeGreaterThan(0);
  });

  test('debe retornar arreglo vacío si no hay coincidencias', () => {
    const results = productService.searchProducts('xyzabc123');
    expect(results).toHaveLength(0);
  });
});

describe('ProductService - filterByCategory', () => {
  test('debe filtrar productos por categoría ropa', () => {
    const results = productService.filterByCategory('ropa');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(p => expect(p.category).toBe('ropa'));
  });

  test('debe retornar todos si no se pasa categoría', () => {
    const results = productService.filterByCategory(null);
    expect(results).toHaveLength(5);
  });

  test('debe ser insensible a mayúsculas', () => {
    const results = productService.filterByCategory('ROPA');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('ProductService - createProduct', () => {
  test('debe crear un producto válido', () => {
    const product = productService.createProduct({
      name: 'Producto Test',
      price: 50000,
      stock: 10,
      category: 'test',
    });
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Producto Test');
    expect(product.price).toBe(50000);
  });

  test('debe lanzar error si falta el nombre', () => {
    expect(() => productService.createProduct({ price: 10000 })).toThrow();
  });

  test('debe lanzar error si el precio es 0', () => {
    expect(() => productService.createProduct({ name: 'Test', price: 0 })).toThrow();
  });

  test('debe lanzar error si el precio es negativo', () => {
    expect(() => productService.createProduct({ name: 'Test', price: -100 })).toThrow();
  });
});

describe('ProductService - updateStock', () => {
  test('debe reducir el stock correctamente', () => {
    const product = productService.updateStock('1', 5);
    expect(product.stock).toBe(45);
  });

  test('debe lanzar error si no hay stock suficiente', () => {
    expect(() => productService.updateStock('1', 1000)).toThrow('Stock insuficiente');
  });

  test('debe lanzar error si el producto no existe', () => {
    expect(() => productService.updateStock('999', 1)).toThrow('Producto no encontrado');
  });
});

describe('ProductService - isInStock', () => {
  test('debe retornar true si hay stock', () => {
    expect(productService.isInStock('1')).toBe(true);
  });

  test('debe retornar false si el producto no existe', () => {
    expect(productService.isInStock('999')).toBe(false);
  });
});
