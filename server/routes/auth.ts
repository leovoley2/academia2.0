import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../src/models/User';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../src/types';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName, role = 'admin' }: RegisterRequest = req.body;

    // Validar campos requeridos
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario (el modelo se encarga del hash de la contraseña)
    const user = new User({
      email: email.toLowerCase(),
      firstName,
      lastName,
      role,
      passwordHash: password, // El middleware pre-save se encarga del hash
      isVerified: true // En desarrollo, auto-verificar
    });

    await user.save();

    // Crear token JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret
    );

    const response: AuthResponse = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString()
      },
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Crear token JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret
    );

    const response: AuthResponse = {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString()
      },
      token
    };

    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Verificar token
router.get('/verify', async (req: express.Request, res: express.Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const response: AuthResponse = {
      success: true,
      message: 'Token válido',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// Logout
router.post('/logout', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

export default router;