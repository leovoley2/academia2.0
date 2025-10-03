// Versión simplificada para Vercel
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// Configuración básica
app.use(express.json());
app.use(cors({
  origin: [
    'https://gestiondeacademia.netlify.app',
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:5173'
  ],
  credentials: true
}));

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academia';
    console.log('🔗 Intentando conectar a MongoDB...', MONGODB_URI ? 'URI configurada' : 'URI no configurada');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    return false;
  }
};

// Esquemas directos en el archivo
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

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// Middleware de autenticación
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

// Middleware para asegurar conexión a DB
const ensureDBConnection = async (req: any, res: any, next: any) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ Reconectando a MongoDB...');
      await connectDB();
    }
    next();
  } catch (error: any) {
    console.error('❌ Error de conexión a DB:', error);
    res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: error.message
    });
  }
};

// Rutas de autenticación
app.post('/api/auth/register', ensureDBConnection, async (req, res) => {
  try {
    console.log('📝 Iniciando proceso de registro...');
    const { email, password, firstName = 'Usuario', lastName = 'Academia' } = req.body;
    console.log('📧 Email recibido:', email);
    
    if (!email || !password) {
      console.log('❌ Faltan datos requeridos');
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    console.log('🔍 Verificando usuario existente...');
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    console.log('🔐 Encriptando contraseña...');
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('👤 Creando usuario...');
    // Crear usuario
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      isVerified: true // Auto-verificar para simplificar
    });

    console.log('💾 Guardando usuario en DB...');
    await user.save();
    console.log('✅ Usuario guardado exitosamente');

    console.log('🎫 Generando JWT token...');
    // Generar JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎉 Registro completado exitosamente');
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
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
    console.error('Error en registro:', error);
    
    // Proporcionar más detalles del error para debugging
    let errorMessage = 'Error del servidor';
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Errores específicos de MongoDB
      if (error.name === 'ValidationError') {
        errorMessage = 'Error de validación en los datos';
      } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        errorMessage = 'Error de conexión a la base de datos';
      } else if (error.message.includes('duplicate key')) {
        errorMessage = 'El email ya está registrado';
      }
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      // En desarrollo, incluir más detalles
      ...(process.env.NODE_ENV !== 'production' && { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'academia-dev-secret-key-2024';
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
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
        error: 'Estudiante no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Estudiante eliminado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error eliminando estudiante'
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await connectDB();
    res.json({ 
      status: 'OK', 
      message: 'Academia API funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'Conectada' : 'Desconectada'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error en health check',
      error: error.message
    });
  }
});

// Aplicar middleware de DB a rutas que lo necesiten
app.use('/api/auth/register', ensureDBConnection);
app.use('/api/auth/login', ensureDBConnection);
app.use('/api/students', ensureDBConnection);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Conectar a MongoDB solo una vez
connectDB();

export default app;