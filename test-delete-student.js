// Test para probar la eliminación de estudiantes
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testStudentDeletion() {
  console.log('🧪 Probando eliminación de estudiantes...');
  
  try {
    // Primero necesitamos autenticarnos para obtener un token
    console.log('\n1. 🔐 Iniciando sesión...');
    const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-1759599771453@example.com', // Usuario que acabamos de crear
        password: 'test123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falló:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login exitoso, token obtenido');
    
    // Obtener lista de estudiantes
    console.log('\n2. 📋 Obteniendo lista de estudiantes...');
    const studentsResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!studentsResponse.ok) {
      console.log('❌ Error obteniendo estudiantes:', studentsResponse.status);
      return;
    }
    
    const studentsData = await studentsResponse.json();
    console.log('📊 Estudiantes encontrados:', studentsData.data?.length || 0);
    
    if (studentsData.data && studentsData.data.length > 0) {
      const studentToDelete = studentsData.data[0];
      console.log('🎯 Intentando eliminar estudiante:', studentToDelete.nombre);
      
      // Intentar eliminar el primer estudiante
      console.log('\n3. 🗑️ Eliminando estudiante...');
      const deleteResponse = await fetch(`${PRODUCTION_URL}/api/students/${studentToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Status de eliminación:', deleteResponse.status);
      
      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log('✅ Eliminación exitosa:', deleteData);
      } else {
        const errorText = await deleteResponse.text();
        console.log('❌ Error en eliminación:', errorText);
      }
    } else {
      console.log('ℹ️ No hay estudiantes para eliminar');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test
testStudentDeletion();