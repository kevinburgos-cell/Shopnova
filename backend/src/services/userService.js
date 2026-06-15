const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'shopnova_secret_2025';

let users = [];

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const register = async (name, email, password) => {
  if (!name || name.trim() === '') throw new Error('El nombre es requerido');
  if (!validateEmail(email)) throw new Error('Email inválido');
  if (!validatePassword(password)) throw new Error('La contraseña debe tener al menos 6 caracteres');

  const exists = users.find(u => u.email === email.toLowerCase());
  if (exists) throw new Error('El email ya está registrado');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const login = async (email, password) => {
  if (!email || !password) throw new Error('Email y contraseña son requeridos');

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) throw new Error('Credenciales inválidas');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const getUserById = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const _resetUsers = () => {
  users = [];
};

module.exports = {
  register,
  login,
  getUserById,
  validateEmail,
  validatePassword,
  verifyToken,
  _resetUsers,
};
