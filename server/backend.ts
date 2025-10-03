import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail, generateSecureToken } from './emailService';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academia';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Modelos de datos
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String },
  fechaIngreso: { type: String, required: true },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  planId: { 
    type: String, 
    required: true,
    enum: ['once_a_week', 'twice_a_week', 'thrice_a_week', 'four_times_a_week']
  },
  paymentDate: { type: String, required: true },
  nextBillingDate: { type: String, required: true },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

// Middleware de autenticación JWT
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario en la base de datos
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar si el email está verificado
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
      });
    }

    // Generar JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: '7d'
    });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Validar campos requeridos mínimos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    // Validar que no exista el usuario
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con este email'
      });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generar token de verificación
    const verificationToken = generateSecureToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    
    // Crear usuario
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName || 'Usuario',
      lastName: lastName || 'Academia',
      role: role || 'admin',
      isVerified: false, // Siempre requerir verificación
      verificationToken,
      verificationTokenExpires: verificationExpires
    });
    
    await user.save();
    
    // Enviar email de verificación
    console.log(`📧 Intentando enviar email de verificación a: ${email}`);
    const emailResult = await sendVerificationEmail(email, verificationToken, firstName || 'Usuario');
    console.log(`📧 Resultado del envío de email:`, emailResult);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: `Cuenta creada exitosamente. Te hemos enviado un email de verificación a ${email}. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.`,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Cuenta creada pero no se pudo enviar el email de verificación. Error: ${emailResult.error || 'Desconocido'}`
      });
    }
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando usuario'
    });
  }
});

// Ruta para verificar email
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificación inválido o expirado'
      });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: '¡Email verificado exitosamente! Ya puedes iniciar sesión.'
    });
    
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Ruta para verificar token JWT
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error verificando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Ruta para solicitar reset de contraseña
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.'
      });
    }
    
    // Generar token de reset
    const resetToken = generateSecureToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();
    
    // Enviar email de reset
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.firstName);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Te hemos enviado un email con instrucciones para restablecer tu contraseña.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error enviando email. Intenta de nuevo más tarde.'
      });
    }
    
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Ruta para restablecer contraseña
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de reset inválido o expirado'
      });
    }
    
    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.'
    });
    
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Rutas de estudiantes
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estudiantes'
    });
  }
});

app.get('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Estudiante no encontrado'
      });
    }
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estudiante'
    });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      avatarUrl: req.body.avatarUrl || `https://picsum.photos/seed/${Date.now()}/100/100`
    };
    
    const student = new Student(studentData);
    await student.save();
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error creando estudiante'
    });
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Estudiante no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error actualizando estudiante'
    });
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Estudiante eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando estudiante'
    });
  }
});

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

startServer();