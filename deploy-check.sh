#!/bin/bash

echo "🚀 Preparando deployment para Vercel..."

# Verificar que los archivos necesarios existen
echo "📁 Verificando archivos de configuración..."

if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json no encontrado"
    exit 1
fi

if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production no encontrado"
    exit 1
fi

if [ ! -f "server/index.ts" ]; then
    echo "❌ Error: server/index.ts no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración verificados"

# Verificar dependencias
echo "📦 Verificando dependencias..."
npm list --depth=0 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️ Instalando dependencias..."
    npm install
fi

# Build del frontend
echo "🏗️ Construyendo frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    echo ""
    echo "🚀 Listo para deployment en Vercel!"
    echo ""
    echo "Para deployar, ejecuta:"
    echo "  npx vercel --prod"
    echo ""
    echo "O visita: https://vercel.com/new"
    echo "Y conecta este repositorio"
else
    echo "❌ Error en el build"
    exit 1
fi