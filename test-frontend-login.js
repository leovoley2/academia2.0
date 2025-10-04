// Test que simula exactamente lo que hace el frontend
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testFrontendLogin() {
  console.log('🎯 Simulando exactamente lo que hace el frontend...');
  
  try {
    // Credenciales que podría usar el usuario
    const email = 'login-test-1759601012905@example.com'; // Usuario que acabamos de crear
    const password = 'logintest123';
    
    console.log('\n🔐 Intentando login con las mismas condiciones del frontend...');
    
    // Simular exactamente la petición del frontend
    const response = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No incluir Authorization header en login (correcto)
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login exitoso (simulando frontend):', data.success);
      console.log('👤 Usuario:', data.user?.email);
      console.log('🎫 Token recibido:', data.token ? 'SÍ' : 'NO');
    } else {
      const errorText = await response.text();
      console.log('❌ Error en login (simulando frontend):');
      console.log('Error response:', errorText);
    }
    
    // Test adicional: intentar con credenciales incorrectas
    console.log('\n🚫 Probando con credenciales incorrectas...');
    const badResponse = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'noexiste@test.com',
        password: 'wrongpassword'
      })
    });
    
    console.log('Bad login status:', badResponse.status);
    if (!badResponse.ok) {
      const badError = await badResponse.json();
      console.log('Expected error:', badError.message);
    }
    
  } catch (error) {
    console.error('❌ Error de red o conexión:', error.message);
  }
}

// Ejecutar test
testFrontendLogin();