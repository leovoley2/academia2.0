// Test detallado para diagnosticar problemas de conexión MongoDB
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testMongoDBConnection() {
  console.log('🔍 Diagnóstico detallado de MongoDB...');
  
  try {
    // Test específico para MongoDB
    console.log('\n1. 📊 Probando endpoint de diagnóstico...');
    const response = await fetch(`${PRODUCTION_URL}/api/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📋 Información completa:');
      console.log(JSON.stringify(data, null, 2));
      
      // Analizar la información
      const { environment } = data;
      
      console.log('\n🔍 Análisis:');
      console.log(`✅ Variable MONGODB_URI configurada: ${environment.hasMongoUri ? 'SÍ' : 'NO'}`);
      console.log(`📝 Prefijo de URI: ${environment.mongoUriPrefix}`);
      console.log(`🌍 Entorno: ${environment.nodeEnv}`);
      console.log(`🔌 Estado de DB: ${data.database}`);
      
      // Verificar problemas comunes
      if (environment.hasMongoUri && data.database === 'Desconectada') {
        console.log('\n⚠️ PROBLEMA DETECTADO:');
        console.log('- La variable MONGODB_URI está configurada');
        console.log('- Pero la conexión falla');
        console.log('\n🔧 Posibles causas:');
        console.log('1. URI no incluye el nombre de la base de datos (/academia)');
        console.log('2. Credenciales incorrectas');
        console.log('3. IP no autorizada en MongoDB Atlas');
        console.log('4. Timeout de conexión');
        
        if (environment.mongoUriPrefix && !environment.mongoUriPrefix.includes('/academia')) {
          console.log('\n❌ PROBABLE CAUSA: Falta /academia en la URI');
          console.log('La URI debe terminar con: .../academia?retryWrites=true...');
        }
      }
      
    } else {
      console.log('❌ Error en health check:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar diagnóstico
testMongoDBConnection();