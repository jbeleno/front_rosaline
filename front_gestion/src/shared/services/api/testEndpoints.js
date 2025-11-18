/**
 * Script de prueba para verificar que los endpoints funcionen
 * Ejecutar en la consola del navegador: testEndpoints()
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export async function testEndpoints() {
  console.log('🧪 Iniciando pruebas de endpoints...\n');
  
  const tests = [
    {
      name: 'Productos',
      endpoint: API_ENDPOINTS.PRODUCTOS,
      test: async () => await apiClient.get(API_ENDPOINTS.PRODUCTOS)
    },
    {
      name: 'Categorías',
      endpoint: API_ENDPOINTS.CATEGORIAS,
      test: async () => await apiClient.get(API_ENDPOINTS.CATEGORIAS)
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📡 Probando: ${test.name} (${test.endpoint})`);
      const startTime = Date.now();
      const data = await test.test();
      const duration = Date.now() - startTime;
      
      if (Array.isArray(data)) {
        console.log(`✅ ${test.name}: OK - ${data.length} elementos encontrados (${duration}ms)`);
      } else if (data) {
        console.log(`✅ ${test.name}: OK - Datos recibidos (${duration}ms)`);
      } else {
        console.log(`⚠️ ${test.name}: Respuesta vacía (${duration}ms)`);
      }
      console.log('Datos:', data);
    } catch (error) {
      console.error(`❌ ${test.name}: ERROR -`, error.message);
    }
    console.log('---\n');
  }
}

// Hacer disponible globalmente para testing
if (typeof window !== 'undefined') {
  window.testEndpoints = testEndpoints;
}

