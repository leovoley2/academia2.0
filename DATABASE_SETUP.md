# Academia Manager - Base de Datos Real

## 🚀 Configuración de Base de Datos

Esta aplicación ahora está configurada para funcionar con una base de datos MongoDB real, permitiendo que la información persista entre dispositivos y sesiones.

### 📋 Configuración Rápida

1. **Variables de Entorno**
   - Copia el archivo `.env.example` a `.env`
   - Actualiza la variable `VITE_MONGODB_URI` con tu conexión a MongoDB

2. **Opciones de Base de Datos**

   **Opción A: MongoDB Local**
   ```bash
   VITE_MONGODB_URI=mongodb://localhost:27017/academia
   ```

   **Opción B: MongoDB Atlas (Recomendado)**
   ```bash
   VITE_MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/academia
   ```

### 🛠️ Comandos Disponibles

```bash
# Solo frontend (con mock data)
npm run dev

# Backend + Base de datos real
npm run backend:dev

# Frontend + Backend juntos
npm run dev:full

# Build para producción
npm run build
```

### 🔄 Modo de Funcionamiento

La aplicación funciona con **fallback inteligente**:

1. **Primero intenta** conectar a la base de datos real
2. **Si falla**, usa datos mock como respaldo
3. **Los datos se guardan** en MongoDB cuando está disponible

### 🗃️ Estructura de Datos

**Estudiantes:**
- nombre, email, teléfono
- fechaIngreso, estado
- planId, paymentDate, nextBillingDate
- avatarUrl (generado automáticamente)

**Usuarios:**
- email, password (encriptado)
- firstName, lastName, role
- Tokens JWT para autenticación

### 📱 Persistencia Multi-Dispositivo

✅ **Los datos persisten** entre:
- Diferentes navegadores
- Diferentes dispositivos
- Reinicios del servidor
- Actualizaciones de la aplicación

### 🔐 Autenticación

**Credenciales por defecto:**
- Email: `admin@academia.com`
- Password: `admin123`

**Características:**
- ✅ Sin datos precargados
- ✅ Campos de login limpios
- ✅ Registro de nuevos usuarios
- ✅ Tokens de sesión seguros

### 🎯 Características Implementadas

- ✅ Base de datos MongoDB real
- ✅ API REST completa
- ✅ Autenticación JWT
- ✅ Datos vacíos por defecto
- ✅ Campos de login limpios
- ✅ Cálculo inteligente de fechas
- ✅ Persistencia multi-dispositivo
- ✅ Fallback a mock si falla DB

### 📦 Para Producción

1. **Configurar MongoDB Atlas**
2. **Actualizar variables de entorno**
3. **Desplegar backend en servicio cloud**
4. **Actualizar VITE_API_URL en frontend**

¡La aplicación está lista para uso en producción con base de datos real! 🎉