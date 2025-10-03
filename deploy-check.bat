@echo off
echo 🚀 Preparando deployment para Vercel...

REM Verificar que los archivos necesarios existen
echo 📁 Verificando archivos de configuración...

if not exist "vercel.json" (
    echo ❌ Error: vercel.json no encontrado
    exit /b 1
)

if not exist ".env.production" (
    echo ❌ Error: .env.production no encontrado
    exit /b 1
)

if not exist "server\index.ts" (
    echo ❌ Error: server\index.ts no encontrado
    exit /b 1
)

echo ✅ Archivos de configuración verificados

REM Build del frontend
echo 🏗️ Construyendo frontend...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build completado exitosamente
    echo.
    echo 🚀 Listo para deployment en Vercel!
    echo.
    echo Para deployar, ejecuta:
    echo   npx vercel --prod
    echo.
    echo O visita: https://vercel.com/new
    echo Y conecta este repositorio
) else (
    echo ❌ Error en el build
    exit /b 1
)