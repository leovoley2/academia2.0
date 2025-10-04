// Test específico para registro de estudiantes
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testStudentRegistration() {
  console.log('🧪 Diagnosticando problema con registro de estudiantes...');
  
  try {
    // 1. Crear un usuario y obtener token
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
    
    // 2. Intentar crear un estudiante
    console.log('\n2. 👨‍🎓 Creando estudiante...');
    const studentData = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '987654321',
      fechaIngreso: '2024-10-01',
      planId: 'once_a_week',
      paymentDate: '2024-10-01',
      nextBillingDate: '2024-11-01',
      estado: 'activo'
    };
    
    console.log('📊 Datos del estudiante:', JSON.stringify(studentData, null, 2));
    
    const createResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(studentData)
    });
    
    console.log('📈 Status de creación:', createResponse.status);
    console.log('📋 Headers de respuesta:', Object.fromEntries(createResponse.headers.entries()));
    
    if (createResponse.ok) {
      const createdStudent = await createResponse.json();
      console.log('✅ Estudiante creado exitosamente:', createdStudent);
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Error creando estudiante:');
      console.log('Error response:', errorText);
    }
    
    // 3. Verificar lista de estudiantes
    console.log('\n3. 📋 Verificando lista de estudiantes...');
    const listResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('Lista status:', listResponse.status);
    
    if (listResponse.ok) {
      const studentsData = await listResponse.json();
      console.log('📊 Estudiantes en DB:', studentsData.data?.length || 0);
      if (studentsData.data && studentsData.data.length > 0) {
        console.log('🎯 Primer estudiante:', studentsData.data[0].nombre);
      }
    } else {
      const listError = await listResponse.text();
      console.log('❌ Error obteniendo lista:', listError);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar test
testStudentRegistration();