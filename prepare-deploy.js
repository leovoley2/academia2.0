const fs = require('fs');

console.log('📦 Preparando archivos para deploy...');

// Crear un archivo de timestamp para forzar el deploy
const timestamp = new Date().toISOString();
fs.writeFileSync('.vercel-deploy', `Deploy: ${timestamp}`);

console.log('✅ Archivos preparados');
console.log('🚀 Por favor ejecuta: vercel --prod');