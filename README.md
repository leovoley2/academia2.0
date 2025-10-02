# 🎓 Academia Student Manager# Academia Student Manager# React + TypeScript + Vite



Sistema de gestión académica desarrollado con React, TypeScript, Express.js y MongoDB Atlas. Permite el registro de administradores y la gestión completa de estudiantes con planes de pago.



## 🚀 CaracterísticasSistema de gestión de estudiantes para academia con MongoDB y autenticación completa.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



- **Autenticación JWT** - Sistema seguro de login/registro para administradores

- **Gestión de Estudiantes** - CRUD completo con información detallada

- **Planes de Pago** - Sistema de facturación con diferentes frecuencias## 🚀 CaracterísticasCurrently, two official plugins are available:

- **MongoDB Atlas** - Base de datos en la nube

- **TypeScript** - Tipado estático para mayor robustez

- **Responsive Design** - Interfaz moderna con Tailwind CSS

- ✅ **Autenticación completa**: Login, registro de administradores- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

## 🛠️ Tecnologías

- ✅ **Base de datos MongoDB**: Esquemas completos preparados- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Frontend

- **React 19** - Framework principal- ✅ **Gestión de estudiantes**: CRUD completo con planes 

- **TypeScript** - Tipado estático

- **Tailwind CSS** - Estilos y diseño- ✅ **Dashboard interactivo**: Gráficos de ingresos## React Compiler

- **Vite** - Build tool y desarrollo

- **Recharts** - Gráficos y visualizaciones- ✅ **Interfaz moderna**: Tailwind CSS



### Backend- ✅ **TypeScript**: Tipado completoThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Express.js** - Servidor web

- **MongoDB Atlas** - Base de datos

- **Mongoose** - ODM para MongoDB

- **JWT** - Autenticación## 🛠️ Configuración Rápida## Expanding the ESLint configuration

- **bcryptjs** - Hash de contraseñas



## 📋 Requisitos Previos

### 1. Instalar dependencias:If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Node.js** 18+ 

- **npm** o **yarn**```bash

- **Cuenta en MongoDB Atlas** (gratuita)

npm install```js

## ⚡ Instalación Rápida

```export default defineConfig([

### 1. Clonar el repositorio

```bash  globalIgnores(['dist']),

git clone [URL-DEL-REPOSITORIO]

cd academia-frontend### 2. Configurar variables de entorno:  {

```

```bash    files: ['**/*.{ts,tsx}'],

### 2. Instalar dependencias

```bash# Ya está configurado en .env    extends: [

npm install

```MONGODB_URI=mongodb://localhost:27017/academia-dev      // Other configs...



### 3. Configurar variables de entorno```

```bash

# Copia el archivo de ejemplo      // Remove tseslint.configs.recommended and replace with this

cp .env.example .env

### 3. Iniciar aplicación:      tseslint.configs.recommendedTypeChecked,

# Edita el archivo .env con tus credenciales

``````bash      // Alternatively, use this for stricter rules



### 4. Configurar MongoDB Atlasnpm run dev      tseslint.configs.strictTypeChecked,

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)

2. Crea un nuevo cluster (gratis)```      // Optionally, add this for stylistic rules

3. Crea un usuario de base de datos

4. Obtén la cadena de conexión      tseslint.configs.stylisticTypeChecked,

5. Actualiza `MONGODB_URI` en tu archivo `.env`

### 4. Acceder:

### 5. Ejecutar la aplicación

```bash- URL: http://localhost:5173      // Other configs...

# Terminal 1: Backend

npm run server:dev- Login: admin@example.com / password    ],



# Terminal 2: Frontend  - Registro: Hacer clic en "Registrar Administrador"    languageOptions: {

npm run dev

```      parserOptions: {



## 🔧 Configuración## 📝 Funcionalidades Implementadas        project: ['./tsconfig.node.json', './tsconfig.app.json'],



### Variables de Entorno (.env)        tsconfigRootDir: import.meta.dirname,



```env### ✅ Registro de Administradores      },

# Base de Datos MongoDB Atlas

MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/academia-dev- Formulario completo con validaciones      // other options...



# JWT Configuration- Roles: Admin y Super Admin    },

JWT_SECRET=tu-clave-super-secreta-aqui

JWT_EXPIRES_IN=7d- Verificación de email único  },



# Puertos- Encriptación de contraseñas (simulada)])

PORT=5173

API_PORT=3002```



# Entorno### ✅ Schemas de MongoDB

NODE_ENV=development

```- **Users**: email, password, firstName, lastName, roleYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



### Scripts Disponibles- **Students**: name, plan, payments, emergency contact



```bash- **Payments**: amount, method, status, receipt```js

# Desarrollo

npm run dev          # Frontend (puerto 5173)// eslint.config.js

npm run server:dev   # Backend (puerto 3002)

### ✅ Sistema de Autenticaciónimport reactX from 'eslint-plugin-react-x'

# Producción

npm run build        # Construir frontend- JWT tokensimport reactDom from 'eslint-plugin-react-dom'

npm run preview      # Preview del build

```- Sesiones persistentes



## 📚 Estructura del Proyecto- Logout seguroexport default defineConfig([



```  globalIgnores(['dist']),

academia-frontend/

├── src/                    # Frontend React## 🔧 Para Producción con MongoDB Real  {

│   ├── components/         # Componentes React

│   ├── services/          # API services    files: ['**/*.{ts,tsx}'],

│   ├── models/            # Modelos MongoDB

│   ├── config/            # Configuraciones1. **Instalar MongoDB localmente**    extends: [

│   ├── types.ts           # Tipos TypeScript

│   └── App.tsx            # Componente principal2. **Actualizar conexión en `src/config/database.ts`**      // Other configs...

├── server/                # Backend Express

│   ├── routes/           # Rutas de la API3. **Cambiar `apiService.ts` para usar endpoints reales**      // Enable lint rules for React

│   ├── mockStore.ts      # Store en memoria (desarrollo)

│   └── index.ts          # Servidor principal      reactX.configs['recommended-typescript'],

├── public/               # Archivos estáticos

└── docs/                 # Documentación## 📁 Estructura Preparada      // Enable lint rules for React DOM

```

      reactDom.configs.recommended,

## 🎯 Uso

```    ],

### 1. Registro de Administrador

1. Ve a `http://localhost:5173/`src/    languageOptions: {

2. Completa el formulario de registro

3. El sistema te redirigirá al login├── models/           # Schemas MongoDB listos      parserOptions: {



### 2. Gestión de Estudiantes├── config/           # Configuración DB        project: ['./tsconfig.node.json', './tsconfig.app.json'],

1. Inicia sesión con tus credenciales

2. Ve al dashboard principal├── services/         # API services        tsconfigRootDir: import.meta.dirname,

3. Usa el botón "+" para agregar estudiantes

4. Completa la información requerida├── components/       # UI components      },

5. Gestiona pagos y fechas de facturación

└── utils/            # Utilidades auth      // other options...

### 3. Planes Disponibles

- **Una vez por semana** - `once_a_week````    },

- **Dos veces por semana** - `twice_a_week`  

- **Tres veces por semana** - `thrice_a_week`  },

- **Cuatro veces por semana** - `four_times_a_week`

La aplicación está **100% lista** para conectar con MongoDB real. Solo necesitas activar la conexión a base de datos.])

## 📡 API Endpoints```


### Autenticación
```
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Iniciar sesión
GET  /api/auth/verify      # Verificar token
POST /api/auth/logout      # Cerrar sesión
```

### Estudiantes
```
GET    /api/students       # Listar estudiantes
POST   /api/students       # Crear estudiante
GET    /api/students/:id   # Obtener estudiante
PUT    /api/students/:id   # Actualizar estudiante
DELETE /api/students/:id   # Eliminar estudiante
```

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
npm run build
# Subir la carpeta 'dist' a tu hosting
```

### Backend (Railway/Render)
1. Configura las variables de entorno en el hosting
2. Despliega desde la carpeta del proyecto
3. Usa el comando: `npm run server:dev`

## 🐛 Troubleshooting

### Error de Conexión MongoDB
```bash
# Verifica que la IP esté en whitelist de MongoDB Atlas
# Verifica las credenciales en .env
# Asegúrate de que el cluster esté activo
```

### Error de CORS
```bash
# Verifica que el frontend esté en el puerto correcto
# Actualiza la configuración de CORS en server/index.ts
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un [Issue](../../issues) en GitHub
- Revisa la [documentación](./docs/)

---

Desarrollado con ❤️ para la gestión académica moderna.