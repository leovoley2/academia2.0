import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testUserRegistration() {
  console.log('🔍 Probando registro de usuario...');
  
  const API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';
  console.log('🌐 API URL:', API_URL);
  
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123',
    firstName: 'Usuario',
    lastName: 'Prueba'
  };
  
  try {
    console.log('📤 Enviando solicitud de registro...');
    console.log('📧 Email:', testUser.email);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    console.log('📊 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Respuesta:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Usuario registrado exitosamente!');
    } else {
      console.log('❌ Error en el registro:');
      console.log('💬 Mensaje:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 El servidor backend no está funcionando en:', API_URL);
      console.log('💡 Ejecuta: npm run backend:dev');
    }
  }
}

testUserRegistration();