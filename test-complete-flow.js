// Test completo: registro → login → crear estudiante → eliminar estudiante
const PRODUCTION_URL = 'https://academia2-0-ochre.vercel.app';

async function testCompleteFlow() {
  console.log('🧪 Test completo: registro → login → crear estudiante → eliminar...');
  
  try {
    // 1. Registrar nuevo usuario
    console.log('\n1. 📝 Registrando nuevo usuario...');
    const email = `admin-${Date.now()}@example.com`;
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: 'admin123456',
        firstName: 'Admin',
        lastName: 'Test'
      })
    });
    
    if (!registerResponse.ok) {
      console.log('❌ Registro falló:', registerResponse.status);
      return;
    }
    
    const registerData = await registerResponse.json();
    const token = registerData.token;
    console.log('✅ Usuario registrado y token obtenido');
    
    // 2. Crear un estudiante de prueba
    console.log('\n2. 👨‍🎓 Creando estudiante de prueba...');
    const studentData = {
      nombre: 'Estudiante Test',
      email: 'estudiante.test@example.com',
      telefono: '123456789',
      fechaIngreso: '2024-01-01',
      planId: 'once_a_week',
      paymentDate: '2024-01-01',
      nextBillingDate: '2024-02-01'
    };
    
    const createResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(studentData)
    });
    
    if (!createResponse.ok) {
      console.log('❌ Error creando estudiante:', createResponse.status);
      const errorText = await createResponse.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const createdStudent = await createResponse.json();
    console.log('✅ Estudiante creado:', createdStudent.data.nombre);
    
    // 3. Eliminar el estudiante
    console.log('\n3. 🗑️ Eliminando estudiante...');
    const studentId = createdStudent.data._id;
    
    const deleteResponse = await fetch(`${PRODUCTION_URL}/api/students/${studentId}`, {
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
    
    // 4. Verificar que se eliminó
    console.log('\n4. ✅ Verificando eliminación...');
    const checkResponse = await fetch(`${PRODUCTION_URL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (checkResponse.ok) {
      const studentsData = await checkResponse.json();
      const stillExists = studentsData.data?.find(s => s._id === studentId);
      if (stillExists) {
        console.log('❌ El estudiante AÚN EXISTE - eliminación falló');
      } else {
        console.log('✅ Estudiante eliminado correctamente');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test
testCompleteFlow();