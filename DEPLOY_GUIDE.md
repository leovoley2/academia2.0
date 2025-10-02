# 🚀 Guía de Despliegue a Git

Esta guía te ayudará a subir tu proyecto Academia Student Manager a un repositorio Git (GitHub, GitLab, etc.).

## 📋 Requisitos Previos

### 1. Instalar Git
**Windows:**
- Descarga Git desde: https://git-scm.com/download/windows
- Ejecuta el instalador y sigue las instrucciones
- Reinicia PowerShell después de la instalación

**Verificar instalación:**
```bash
git --version
```

### 2. Configurar Git (primera vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## 🛠️ Pasos para Subir a GitHub

### 1. Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository" (+ en la esquina superior derecha)
3. Nombra el repositorio: `academia-student-manager`
4. Agrega descripción: `Sistema de gestión académica con React y MongoDB`
5. **NO inicialices** con README, .gitignore o LICENSE (ya los tenemos)
6. Haz clic en "Create repository"

### 2. Comandos Git para subir el proyecto
```bash
# 1. Inicializar repositorio
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "🎉 Initial commit: Academia Student Manager

- Sistema completo de gestión académica
- Frontend: React 19 + TypeScript + Tailwind CSS
- Backend: Express.js + MongoDB Atlas
- Autenticación JWT
- CRUD de estudiantes y planes de pago"

# 4. Conectar con el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/academia-student-manager.git

# 5. Subir al repositorio
git branch -M main
git push -u origin main
```

### 3. Estructura final del repositorio
```
academia-student-manager/
├── README.md                 ✅ Documentación completa
├── .gitignore               ✅ Archivos ignorados
├── .env.example             ✅ Ejemplo de variables
├── package.json             ✅ Dependencias
├── src/                     ✅ Frontend React
├── server/                  ✅ Backend Express
└── MONGODB_TEST.md          ✅ Guía de pruebas
```

## 🔄 Comandos Git Útiles

### Commits posteriores
```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad"

# Subir cambios
git push
```

### Tipos de commits (convención)
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de errores
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan el código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests

### Verificar estado
```bash
git status          # Ver archivos modificados
git log --oneline   # Ver historial de commits
git remote -v       # Ver repositorios remotos
```

## 🌐 Alternativas a GitHub

### GitLab
```bash
git remote add origin https://gitlab.com/TU_USUARIO/academia-student-manager.git
```

### Bitbucket
```bash
git remote add origin https://bitbucket.org/TU_USUARIO/academia-student-manager.git
```

## 🚀 Después de subir el repositorio

### 1. Actualizar README.md
- Reemplaza `[URL-DEL-REPOSITORIO]` con la URL real
- Agrega badges de estado si lo deseas

### 2. Configurar GitHub Pages (opcional)
- Ve a Settings > Pages en tu repositorio
- Selecciona source: "GitHub Actions"
- Tu app se desplegará automáticamente

### 3. Invitar colaboradores
- Ve a Settings > Manage access
- Haz clic en "Invite a collaborator"

## 🔒 Seguridad

**IMPORTANTE:** 
- ✅ El archivo `.env` está en `.gitignore` (no se sube)
- ✅ Solo `.env.example` se sube al repositorio
- ✅ Las credenciales reales permanecen locales

## 📞 Ayuda

Si tienes problemas:
1. Verifica que Git esté instalado: `git --version`
2. Revisa que el repositorio remoto esté configurado: `git remote -v`
3. Consulta la documentación de GitHub: https://docs.github.com

¡Tu proyecto estará disponible públicamente y listo para compartir! 🎉