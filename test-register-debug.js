// Test para diagnosticar errores de registro en producción
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testProductionRegistration() {
  console.log('🧪 Diagnosticando errores de registro en producción...');
  console.log(`🌐 URL: ${PRODUCTION_URL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1. ✅ Probando health check...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    console.log(`Status: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health response:', healthData);
    } else {
      const errorText = await healthResponse.text();
      console.log('❌ Health check failed:', errorText);
    }
    
    // Test 2: Registro con datos válidos
    console.log('\n2. 🔐 Probando registro...');
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User'
    };
    
    console.log('Datos de registro:', testUser);
    
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    console.log(`Register status: ${registerResponse.status}`);
    console.log('Response headers:', Object.fromEntries(registerResponse.headers.entries()));
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registro exitoso:', registerData);
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Error en registro:');
      console.log('Status:', registerResponse.status);
      console.log('Response:', errorText);
      
      // Intentar parsear como JSON si es posible
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Error JSON:', errorJson);
      } catch (e) {
        console.log('Error no es JSON válido');
      }
    }
    
    // Test 3: Registro con datos inválidos (para verificar validación)
    console.log('\n3. 🚫 Probando registro con datos inválidos...');
    const invalidUser = {
      email: 'invalid-email',
      password: ''
    };
    
    const invalidResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    
    console.log(`Invalid register status: ${invalidResponse.status}`);
    const invalidText = await invalidResponse.text();
    console.log('Invalid response:', invalidText);
    
  } catch (error) {
    console.error('❌ Error completo en la prueba:', error);
    console.error('Stack trace:', error.stack);
  }
}

testProductionRegistration();