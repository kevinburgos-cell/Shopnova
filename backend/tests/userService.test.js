const userService = require('../src/services/userService');

beforeEach(() => {
  userService._resetUsers();
});

describe('UserService - validateEmail', () => {
  test('debe aceptar email válido', () => {
    expect(userService.validateEmail('kevin@gmail.com')).toBe(true);
  });

  test('debe rechazar email sin @', () => {
    expect(userService.validateEmail('kevingmail.com')).toBe(false);
  });

  test('debe rechazar email sin dominio', () => {
    expect(userService.validateEmail('kevin@')).toBe(false);
  });

  test('debe rechazar email vacío', () => {
    expect(userService.validateEmail('')).toBe(false);
  });
});

describe('UserService - validatePassword', () => {
  test('debe aceptar contraseña de 6+ caracteres', () => {
    expect(userService.validatePassword('123456')).toBe(true);
  });

  test('debe rechazar contraseña corta', () => {
    expect(userService.validatePassword('123')).toBe(false);
  });

  test('debe rechazar contraseña vacía', () => {
    expect(userService.validatePassword('')).toBe(false);
  });

  test('debe rechazar null', () => {
    expect(userService.validatePassword(null)).toBe(false);
  });
});

describe('UserService - register', () => {
  test('debe registrar un usuario válido', async () => {
    const user = await userService.register('Kevin Burgos', 'kevin@test.com', 'password123');
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('kevin@test.com');
    expect(user).not.toHaveProperty('password');
  });

  test('no debe exponer la contraseña', async () => {
    const user = await userService.register('Ana López', 'ana@test.com', 'secreta123');
    expect(user.password).toBeUndefined();
  });

  test('debe lanzar error si el email ya existe', async () => {
    await userService.register('Kevin', 'repetido@test.com', 'pass123');
    await expect(userService.register('Otro', 'repetido@test.com', 'pass456')).rejects.toThrow('ya está registrado');
  });

  test('debe lanzar error si el nombre está vacío', async () => {
    await expect(userService.register('', 'test@test.com', 'pass123')).rejects.toThrow('nombre');
  });

  test('debe lanzar error si el email es inválido', async () => {
    await expect(userService.register('Kevin', 'emailmal', 'pass123')).rejects.toThrow('Email inválido');
  });

  test('debe lanzar error si la contraseña es muy corta', async () => {
    await expect(userService.register('Kevin', 'k@test.com', '123')).rejects.toThrow('6 caracteres');
  });

  test('el email debe guardarse en minúsculas', async () => {
    const user = await userService.register('Kevin', 'KEVIN@TEST.COM', 'password123');
    expect(user.email).toBe('kevin@test.com');
  });
});

describe('UserService - login', () => {
  beforeEach(async () => {
    await userService.register('Kevin Burgos', 'kevin@login.com', 'mipass123');
  });

  test('debe hacer login con credenciales correctas', async () => {
    const result = await userService.login('kevin@login.com', 'mipass123');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('kevin@login.com');
  });

  test('debe lanzar error con contraseña incorrecta', async () => {
    await expect(userService.login('kevin@login.com', 'wrongpass')).rejects.toThrow('Credenciales inválidas');
  });

  test('debe lanzar error si el usuario no existe', async () => {
    await expect(userService.login('noexiste@test.com', 'pass123')).rejects.toThrow('Credenciales inválidas');
  });

  test('debe lanzar error si faltan campos', async () => {
    await expect(userService.login('', '')).rejects.toThrow('requeridos');
  });
});

describe('UserService - verifyToken', () => {
  test('debe retornar payload con token válido', async () => {
    const result = await userService.login('kevin@login.com', 'mipass123').catch(async () => {
      await userService.register('Kevin', 'kevin@login.com', 'mipass123');
      return userService.login('kevin@login.com', 'mipass123');
    });
    const payload = userService.verifyToken(result.token);
    expect(payload).not.toBeNull();
    expect(payload).toHaveProperty('email');
  });

  test('debe retornar null con token inválido', () => {
    const payload = userService.verifyToken('token.invalido.xyz');
    expect(payload).toBeNull();
  });

  test('debe retornar null con token vacío', () => {
    expect(userService.verifyToken('')).toBeNull();
  });
});
