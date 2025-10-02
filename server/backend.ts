import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String },
  fechaIngreso: { type: String, required: true },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  planId: { type: String, required: true },
  paymentDate: { type: String, required: true },
  nextBillingDate: { type: String, required: true },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

// Middleware de autenticación simple
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de acceso requerido' });
  }
  
  // En un entorno real, aquí verificarías el JWT
  // Por ahora, aceptamos cualquier token para demo
  req.user = { id: 'demo-user' };
  next();
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Por seguridad en demo, aceptar credenciales específicas
    if (email === 'admin@academia.com' && password === 'admin123') {
      const token = 'demo-token-' + Date.now();
      res.json({
        success: true,
        user: {
          id: '1',
          email,
          role: 'admin',
          isVerified: true
        },
        token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Crear usuario (en demo, solo simular)
    const token = 'demo-token-' + Date.now();
    res.json({
      success: true,
      user: {
        id: Date.now().toString(),
        email,
        role: role || 'admin',
        isVerified: true
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando usuario'
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