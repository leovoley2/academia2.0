// Test para diagnosticar el error 400 en creación de estudiantes
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testStudentCreation400() {
  console.log('🔍 Diagnosticando error 400 en creación de estudiantes...');
  
  try {
    // 1. Crear admin y obtener token
    console.log('\n1. 📝 Creando usuario admin...');
    const adminEmail = `admin-${Date.now()}@example.com`;
    const adminPassword = 'admin123456';
    
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'Test'
      })
    });
    
    if (!registerResponse.ok) {
      console.log('❌ Error registrando admin:', registerResponse.status);
      return;
    }
    
    const adminData = await registerResponse.json();
    const token = adminData.token;
    console.log('✅ Admin creado, token obtenido');
    
    // 2. Probar diferentes variaciones de datos de estudiante
    const testCases = [
      {
        name: 'Datos completos y válidos',
        data: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@example.com',
          telefono: '987654321',
          fechaIngreso: '2024-10-01',
          planId: 'once_a_week',
          paymentDate: '2024-10-01',
          nextBillingDate: '2024-11-01',
          estado: 'activo'
        }
      },
      {
        name: 'Datos mínimos requeridos',
        data: {
          nombre: 'María García',
          email: 'maria.garcia@example.com',
          fechaIngreso: '2024-10-01',
          planId: 'once_a_week',
          paymentDate: '2024-10-01',
          nextBillingDate: '2024-11-01'
        }
      },
      {
        name: 'Datos como envía el frontend (simulando)',
        data: {
          nombre: 'Carlos López',
          email: 'carlos.lopez@example.com',
          telefono: '123456789',
          fechaIngreso: new Date().toISOString().split('T')[0],
          estado: 'activo',
          planId: 'once_a_week',
          paymentDate: new Date().toISOString().split('T')[0],
          nextBillingDate: (() => {
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + 1);
            return nextDate.toISOString().split('T')[0];
          })()
        }
      }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n${i + 2}. 🧪 Probando: ${testCase.name}`);
      console.log('📊 Datos:', JSON.stringify(testCase.data, null, 2));
      
      const createResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testCase.data)
      });
      
      console.log('📈 Status:', createResponse.status);
      
      if (createResponse.ok) {
        const result = await createResponse.json();
        console.log('✅ Éxito:', result.data?.nombre);
      } else {
        const errorText = await createResponse.text();
        console.log('❌ Error 400 details:', errorText);
        
        // Intentar parsear como JSON para ver el error específico
        try {
          const errorJson = JSON.parse(errorText);
          console.log('🔍 Error específico:', errorJson.message || errorJson.error);
        } catch (e) {
          console.log('📝 Error raw:', errorText);
        }
      }
    }
    
    // 3. Probar con datos inválidos para confirmar validación
    console.log('\n5. 🚫 Probando datos inválidos (esperamos error 400)...');
    const invalidData = {
      // Faltan campos requeridos
      email: 'invalid@test.com'
    };
    
    const invalidResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(invalidData)
    });
    
    console.log('Invalid data status:', invalidResponse.status);
    if (!invalidResponse.ok) {
      const invalidError = await invalidResponse.text();
      console.log('Expected validation error:', invalidError);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar test
testStudentCreation400();