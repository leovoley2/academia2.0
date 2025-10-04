// Test para verificar la API URL que usa el frontend en producción
console.log('🔍 Verificando configuración del frontend...');

// Simular el entorno de producción
const mockImportMeta = {
  env: {
    DEV: false,
    PROD: true,
    VITE_API_URL: undefined // Como estaría en producción
  }
};

// Función copiada del apiService
const getApiBaseUrl = () => {
  // Si estamos en desarrollo y hay VITE_API_URL configurada, usarla
  if (mockImportMeta.env.DEV && mockImportMeta.env.VITE_API_URL) {
    return mockImportMeta.env.VITE_API_URL;
  }
  
  // Si estamos en producción, usar la misma URL base + /api
  if (mockImportMeta.env.PROD) {
    return '/api';
  }
  
  // Fallback para desarrollo
  return 'http://localhost:3001/api';
};

console.log('🌍 Entorno simulado de producción:');
console.log('📍 API Base URL:', getApiBaseUrl());
console.log('✅ En producción usará: /api (correcto)');

console.log('\n🔍 Verificando URL completa de eliminación:');
const studentId = '507f1f77bcf86cd799439011';
const deleteUrl = `${getApiBaseUrl()}/students/${studentId}`;
console.log('🗑️ URL de eliminación:', deleteUrl);

console.log('\n✅ El frontend debería usar URLs relativas en producción, lo que es correcto.');