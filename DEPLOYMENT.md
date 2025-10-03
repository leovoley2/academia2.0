# 🚀 Guía de Deployment en Vercel

## Academia Student Manager - Deployment Guide

### 📋 Pre-requisitos
- [x] Cuenta en Vercel (https://vercel.com)
- [x] Repositorio en GitHub/GitLab/Bitbucket
- [x] Código preparado para producción

### 🔧 Configuración Completada

#### ✅ Archivos de Configuración
- `vercel.json` - Configuración de routing y builds
- `.env.production` - Variables de entorno para producción
- `.vercelignore` - Archivos a excluir del deployment
- Build scripts en `package.json`

#### ✅ Backend Configurado
- Servidor Node.js en `server/index.ts`
- Rutas API modulares
- Autenticación JWT
- Conexión a MongoDB
- CORS configurado para Vercel

#### ✅ Frontend Configurado
- React + TypeScript + Vite
- Build optimizado para producción
- Configuración de proxy para APIs

### 🚀 Pasos para Deployar

#### Opción 1: Deployment Automático (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Preparado para deployment en Vercel"
   git push origin main
   ```

2. **Ve a Vercel Dashboard**
   - Visita: https://vercel.com/new
   - Conecta tu cuenta de GitHub
   - Selecciona este repositorio

3. **Configura Variables de Entorno en Vercel**
   - Ve a: Project Settings → Environment Variables
   - Agrega estas variables:

   ```
   MONGODB_URI = mongodb+srv://arenavoleibolclub_db_user:Arena_1670@academia1.xhpxqih.mongodb.net/academia-dev?retryWrites=true&w=majority&appName=academia1
   JWT_SECRET = academia-production-secret-key-super-secure-2024
   NODE_ENV = production
   EMAIL_USER = arenavoleibolclub@gmail.com
   EMAIL_PASS = Arena_1670
   EMAIL_SERVICE = gmail
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_FROM = Arena voleibol club <arenavoleibolclub@gmail.com>
   APP_NAME = Academia Student Manager
   ```

4. **Deploy**
   - Vercel automáticamente detectará la configuración
   - El deployment iniciará automáticamente
   - Espera 2-3 minutos

#### Opción 2: Deployment Manual

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login a Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### 🧪 Verificar Deployment

Una vez deployado, verifica:

1. **Frontend**: `https://tu-proyecto.vercel.app`
2. **API Health**: `https://tu-proyecto.vercel.app/api/health`
3. **Registro**: Prueba crear un usuario
4. **Login**: Prueba iniciar sesión

### 🔧 Variables de Entorno en Vercel

**IMPORTANTE**: Después del deployment, actualiza en Vercel:
- `FRONTEND_URL` = `https://tu-proyecto.vercel.app`
- `APP_URL` = `https://tu-proyecto.vercel.app`

### 🐛 Solución de Problemas

#### Error "Failed to fetch"
- Verifica que las variables de entorno estén configuradas
- Revisa que `VITE_API_URL=/api` en las variables de entorno

#### Error de CORS
- Verifica que `FRONTEND_URL` esté configurada correctamente
- El CORS está configurado para aceptar subdominios de vercel.app

#### Error de Base de Datos
- Verifica que `MONGODB_URI` esté correcta
- Asegúrate que MongoDB Atlas permita conexiones desde Vercel (0.0.0.0/0)

### 📝 Después del Deployment

1. **Actualiza URLs** en el código si es necesario
2. **Configura dominio personalizado** (opcional)
3. **Configura SSL** (automático en Vercel)
4. **Monitorea logs** en Vercel Dashboard

### 🔗 Enlaces Útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://vercel.com/docs/concepts/deployments)

---

## ✅ Todo está listo para deployment!

Tu aplicación está completamente configurada para funcionar en Vercel con:
- ✅ Frontend React optimizado
- ✅ Backend Node.js serverless
- ✅ Base de datos MongoDB
- ✅ Autenticación JWT
- ✅ Sistema de emails
- ✅ CORS configurado