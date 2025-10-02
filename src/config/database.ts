import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🔍 Variable MONGODB_URI del .env:', process.env.MONGODB_URI ? 'Definida' : 'No definida');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academia-dev';

interface ConnectionStatus {
  isConnected: boolean;
}

const connection: ConnectionStatus = {
  isConnected: false
};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log('Ya conectado a MongoDB');
    return;
  }

  console.log('🔗 Intentando conectar a:', MONGODB_URI.replace(/:[^@]*@/, ':***@')); // Ocultar contraseña en logs

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState === 1;
    
    console.log('✅ Conectado a MongoDB:', MONGODB_URI);
    
    // Manejo de eventos de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de conexión MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📡 MongoDB desconectado');
      connection.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
      connection.isConnected = true;
    });

  } catch (error) {
    console.warn('⚠️ No se pudo conectar a MongoDB:', error);
    console.log('📝 Ejecutándose en modo desarrollo sin base de datos');
    
    // En modo desarrollo, seguir funcionando sin MongoDB
    connection.isConnected = false; // Mantener false para usar fallback
  }
}

async function disconnectDB(): Promise<void> {
  if (!connection.isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log('📡 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error);
    throw error;
  }
}

export { connectDB, disconnectDB, connection };