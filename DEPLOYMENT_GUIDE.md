# 🚀 GUÍA DE DESPLIEGUE PARA ACADEMIA 2.0

## 📋 PROBLEMAS COMUNES Y SOLUCIONES

### 🔧 **CONFIGURACIÓN CORREGIDA**

Los archivos han sido actualizados para soportar deployment en producción:

#### ✅ **Cambios Realizados:**

1. **Server (`server/index.ts`)**:
   - ✅ Configuración de CORS para múltiples dominios
   - ✅ Servir archivos estáticos de React en producción
   - ✅ Variables de entorno mejoradas
   - ✅ Ruta catch-all para SPA routing

2. **Build Configuration (`vite.config.ts`)**:
   - ✅ Proxy para desarrollo
   - ✅ Optimización de chunks para producción
   - ✅ Variables de entorno configuradas

3. **Scripts (`package.json`)**:
   - ✅ Script `start` para producción
   - ✅ Script `build:full` para deploy completo

## 🌐 OPCIONES DE DEPLOYMENT

### **OPCIÓN 1: VERCEL (RECOMENDADO) - Fullstack**

1. **Configurar variables de entorno en Vercel:**
   ```bash
   MONGODB_URI=tu_mongodb_atlas_uri
   JWT_SECRET=tu_jwt_secret_super_seguro
   NODE_ENV=production
   ```

2. **Crear archivo `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/index.html"
       }
     ]
   }
   ```

### **OPCIÓN 2: RAILWAY - Backend + Frontend Separado**

#### Backend en Railway:
1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

#### Frontend en Vercel/Netlify:
1. Build command: `npm run build`
2. Output directory: `dist`
3. Variables de entorno:
   ```bash
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

### **OPCIÓN 3: HEROKU + NETLIFY**

#### Backend (Heroku):
```bash
# Configurar Heroku CLI
heroku create tu-app-backend
heroku config:set MONGODB_URI=tu_uri
heroku config:set JWT_SECRET=tu_secret
heroku config:set NODE_ENV=production
git push heroku main
```

#### Frontend (Netlify):
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Variables:
   ```bash
   VITE_API_URL=https://tu-app-backend.herokuapp.com/api
   ```

## 🔧 CONFIGURACIÓN ESPECÍFICA PARA TU CASO

### **Para GitHub "academia 2.0":**

1. **Actualizar URLs en `server/index.ts`:**
   ```typescript
   // Línea ~37-38, actualizar con tu URL real de Vercel/Netlify
   const allowedOrigins = NODE_ENV === 'production' 
     ? ['https://TU-URL-REAL.vercel.app', 'https://TU-URL-REAL.netlify.app']
   ```

2. **Variables de entorno necesarias:**
   ```bash
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/academia
   JWT_SECRET=academia-super-secret-production-key-2024
   NODE_ENV=production
   PORT=3002
   ```

3. **En tu servicio de hosting, configurar:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18.x o superior

## 🐛 DEBUGGING COMÚN

### **Si la web no carga:**

1. **Verificar logs del servidor:**
   ```bash
   # En Railway/Heroku, ver logs
   heroku logs --tail
   # o en Railway dashboard
   ```

2. **Verificar que el build se completó:**
   ```bash
   npm run build
   # Verificar que existe la carpeta dist/
   ```

3. **Probar localmente en modo producción:**
   ```bash
   npm run build
   NODE_ENV=production npm start
   # Abrir: http://localhost:3002
   ```

### **Si la API no responde:**

1. **Verificar variables de entorno:**
   ```bash
   # Verificar que todas las variables estén configuradas
   echo $MONGODB_URI
   echo $JWT_SECRET
   ```

2. **Probar endpoint de salud:**
   ```bash
   curl https://tu-backend.herokuapp.com/api/health
   ```

### **Si hay errores de CORS:**

1. **Actualizar origins en server/index.ts:**
   ```typescript
   // Agregar tu dominio real
   const allowedOrigins = [
     'https://tu-dominio-real.vercel.app',
     'https://tu-dominio-real.netlify.app'
   ];
   ```

## 📝 CHECKLIST ANTES DE DEPLOY

- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas conexión establecida
- [ ] CORS configurado con dominios correctos
- [ ] Build local funciona: `npm run build`
- [ ] Servidor local funciona: `npm start`
- [ ] URLs actualizadas en código
- [ ] `.env` no está en Git (verificar .gitignore)

## 🆘 SI NADA FUNCIONA

1. **Crear nuevo deployment desde cero:**
   ```bash
   # Fork el repositorio
   # Crear nueva app en Vercel/Railway
   # Configurar variables desde cero
   ```

2. **Verificar que el repositorio tiene la estructura correcta:**
   ```
   tu-repo/
   ├── server/
   ├── src/
   ├── dist/ (después de build)
   ├── package.json
   └── vercel.json (si usas Vercel)
   ```

3. **Contactar soporte:**
   - Railway: Discord/Support
   - Vercel: GitHub Issues
   - Heroku: Support tickets

---

¿Cuál opción de deployment prefieres? Te ayudo a configurarla específicamente para tu caso.