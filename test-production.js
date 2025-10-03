// Test para verificar el backend en producción
// Cambia 'tu-app.vercel.app' por tu URL real de Vercel

const PRODUCTION_URL = 'https://gestiondeacademia.netlify.app/'; // CAMBIA ESTO POR TU URL REAL

async function testProductionAPI() {
  console.log('🧪 Probando API en producción...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Probando health check...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health response:', healthData);
    }
    
    // Test 2: Registro
    console.log('\n2. Probando registro...');
    const registerData = {
      email: `test-${Date.now()}@example.com`,
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });
    
    console.log('Register status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Registro exitoso');
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Error en registro:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error completo:', error);
  }
}

testProductionAPI();