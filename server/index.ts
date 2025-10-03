import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/config/database';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por ventana de tiempo
  message: {
    error: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
  }
});

// Middleware
app.use(helmet());

// Configurar CORS para producción y desarrollo
const allowedOrigins = NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL,
      'https://academia-2-0.vercel.app', 
      'https://gestiondeacademia.netlify.app',
      // Permitir cualquier subdominio de vercel.app
      /^https:\/\/.*\.vercel\.app$/,
    ].filter(Boolean) as (string | RegExp)[]
  : ['http://localhost:5173', 'http://localhost:3000', process.env.APP_URL].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos en producción
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
}

// Conectar a MongoDB Atlas
connectDB().catch(error => {
  console.warn('Advertencia al conectar a MongoDB:', error.message);
  console.log('🚀 Servidor iniciando en modo desarrollo (sin MongoDB)');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Academia API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Servir aplicación React en producción
if (NODE_ENV === 'production') {
  // Todas las rutas que no sean de API deben servir index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error del servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
});

export default app;