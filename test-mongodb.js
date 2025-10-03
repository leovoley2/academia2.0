// Test para verificar que las APIs funcionen con MongoDB
const API_BASE_URL = 'http://localhost:3001/api';

async function testCreateStudent() {
  console.log('🧪 Probando creación de estudiante...');
  
  // Primero necesitamos hacer login para obtener un token
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'leovoley2@gmail.com', // Cambia por tu email registrado
        password: 'tu-password' // Cambia por tu password
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');

    const token = loginData.token;

    // Ahora crear un estudiante de prueba
    const studentData = {
      nombre: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      telefono: '123456789',
      fechaIngreso: '2024-10-02',
      planId: 'twice_a_week',
      paymentDate: '2024-10-02',
      nextBillingDate: '2024-11-02'
    };

    const createResponse = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });

    if (!createResponse.ok) {
      console.log('❌ Error creando estudiante:', await createResponse.text());
      return;
    }

    const createData = await createResponse.json();
    console.log('✅ Estudiante creado exitosamente:', createData);

    // Obtener lista de estudiantes
    const listResponse = await fetch(`${API_BASE_URL}/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!listResponse.ok) {
      console.log('❌ Error obteniendo estudiantes:', await listResponse.text());
      return;
    }

    const listData = await listResponse.json();
    console.log('✅ Lista de estudiantes:', listData);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testCreateStudent();