import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = 12;

// Funciones para hashing de contraseñas
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Funciones para JWT
export interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

// Función para generar tokens aleatorios
export const generateRandomToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validación de contraseña (al menos 6 caracteres)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Sanitización de strings
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};