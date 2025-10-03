import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuración del transporter de email
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Función para generar token seguro
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Función para enviar email de verificación
export const sendVerificationEmail = async (email: string, token: string, firstName: string) => {
  const transporter = createEmailTransporter();
  
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Confirma tu cuenta - Academia Student Manager',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">🎓 Academia Student Manager</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Gracias por registrarte en Academia Student Manager. Para completar tu registro y activar tu cuenta, 
            necesitas verificar tu dirección de email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              ✅ Verificar mi cuenta
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
          </p>
          
          <p style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 12px;">
            ${verificationUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Este enlace expirará en 24 horas por seguridad.
            </p>
            <p style="color: #9ca3af; font-size: 14px; margin: 5px 0 0 0;">
              Si no creaste esta cuenta, puedes ignorar este email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de verificación enviado a: ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error enviando email de verificación:`, error);
    return { success: false, error: 'Error enviando email' };
  }
};

// Función para enviar email de reset de contraseña
export const sendPasswordResetEmail = async (email: string, token: string, firstName: string) => {
  const transporter = createEmailTransporter();
  
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 Restablecer contraseña - Academia Student Manager',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">🎓 Academia Student Manager</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
            Si fuiste tú quien lo solicitó, haz clic en el botón de abajo para crear una nueva contraseña.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🔐 Restablecer contraseña
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
          </p>
          
          <p style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 12px;">
            ${resetUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Este enlace expirará en 1 hora por seguridad.
            </p>
            <p style="color: #9ca3af; font-size: 14px; margin: 5px 0 0 0;">
              Si no solicitaste este cambio, puedes ignorar este email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de reset enviado a: ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error enviando email de reset:`, error);
    return { success: false, error: 'Error enviando email' };
  }
};