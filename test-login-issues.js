// Test específico para diagnosticar problemas de login
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testLoginIssues() {
  console.log('🔍 Diagnosticando problemas de login...');
  
  try {
    // 1. Probar health check primero
    console.log('\n1. ✅ Verificando health check...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health data:', JSON.stringify(healthData, null, 2));
    }
    
    // 2. Crear un usuario nuevo para probar login
    console.log('\n2. 📝 Creando usuario para test de login...');
    const testEmail = `login-test-${Date.now()}@example.com`;
    const testPassword = 'logintest123';
    
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Login',
        lastName: 'Test'
      })
    });
    
    console.log('Register status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Usuario creado exitosamente');
      
      // 3. Ahora probar login con ese usuario
      console.log('\n3. 🔐 Probando login...');
      const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      
      console.log('Login status:', loginResponse.status);
      console.log('Login headers:', Object.fromEntries(loginResponse.headers.entries()));
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login exitoso:', loginData);
      } else {
        const errorText = await loginResponse.text();
        console.log('❌ Error en login:', errorText);
      }
    } else {
      const registerError = await registerResponse.text();
      console.log('❌ Error en registro:', registerError);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar test
testLoginIssues();