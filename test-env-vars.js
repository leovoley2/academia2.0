// Test para verificar variables de entorno en Vercel
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testEnvironmentVariables() {
  console.log('🔍 Verificando variables de entorno en producción...');
  
  try {
    console.log('\n1. ✅ Probando health check con DB info...');
    const response = await fetch(`${PRODUCTION_URL}/api/health`);
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health response:', JSON.stringify(data, null, 2));
      
      // Analizar el estado de la base de datos
      if (data.database === 'Conectada') {
        console.log('✅ Base de datos conectada correctamente');
      } else {
        console.log('❌ Base de datos no conectada');
      }
    } else {
      console.log('❌ Health check failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test
testEnvironmentVariables();