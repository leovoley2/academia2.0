import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Cargar variables de entorno
dotenv.config();

async function testEmailCredentials() {
  console.log('🔍 Verificando credenciales de Gmail...');
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
  console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '***configurada***' : '❌ NO CONFIGURADA');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('🔄 Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Credenciales de Gmail son válidas!');
    
    // Enviar email de prueba
    console.log('📤 Enviando email de prueba...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Enviar a uno mismo para probar
      subject: 'Prueba de configuración - Academia',
      html: `
        <h2>🎉 ¡Configuración exitosa!</h2>
        <p>Este es un email de prueba para verificar que las credenciales de Gmail están funcionando correctamente.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
      `,
    });
    
    console.log('✅ Email de prueba enviado exitosamente!');
    console.log('📧 Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Error en las credenciales de Gmail:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verifica que EMAIL_USER sea correcto');
      console.log('2. Verifica que EMAIL_PASS sea una "App Password" válida');
      console.log('3. Ve a: https://myaccount.google.com/apppasswords');
      console.log('4. Genera una nueva "App Password" para "Mail"');
    }
  }
}

testEmailCredentials();