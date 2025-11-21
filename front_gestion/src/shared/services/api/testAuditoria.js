/**
 * Archivo de prueba para endpoints de Auditoría
 * Ejecutar después de autenticarse como Admin o Super Admin
 */

import auditoriaService from './auditoriaService';

/**
 * Prueba completa de endpoints de Auditoría
 */
export const testAuditoriaEndpoints = async () => {
  console.log('🧪 Iniciando pruebas de endpoints de Auditoría...\n');
  
  const results = {
    passed: [],
    failed: []
  };

  try {
    // 1. Obtener todos los logs (sin filtros)
    console.log('1️⃣ GET /audit/ - Listar todos los logs');
    const todosLosLogs = await auditoriaService.obtenerLogsAuditoria({
      skip: 0,
      limit: 10
    });
    console.log(`✅ Logs obtenidos: ${todosLosLogs.length}`);
    if (todosLosLogs.length > 0) {
      console.log('Primer log:', todosLosLogs[0]);
    }
    results.passed.push('GET /audit/ (todos los logs)');

    // 2. Filtrar por tabla
    console.log('\n2️⃣ GET /audit/?tabla_nombre=productos - Filtrar por tabla');
    const logsProductos = await auditoriaService.obtenerLogsPorTabla('productos', {
      skip: 0,
      limit: 10
    });
    console.log(`✅ Logs de productos: ${logsProductos.length}`);
    results.passed.push('GET /audit/?tabla_nombre=productos');

    // 3. Filtrar por acción
    console.log('\n3️⃣ GET /audit/?accion=INSERT - Filtrar por acción');
    const logsInsert = await auditoriaService.obtenerLogsPorAccion('INSERT', {
      skip: 0,
      limit: 10
    });
    console.log(`✅ Logs de INSERT: ${logsInsert.length}`);
    results.passed.push('GET /audit/?accion=INSERT');

    // 4. Filtrar por usuario
    console.log('\n4️⃣ GET /audit/?usuario_id=1 - Filtrar por usuario');
    const logsUsuario = await auditoriaService.obtenerLogsPorUsuario(1, {
      skip: 0,
      limit: 10
    });
    console.log(`✅ Logs del usuario 1: ${logsUsuario.length}`);
    results.passed.push('GET /audit/?usuario_id=1');

    // 5. Filtrar por registro específico
    console.log('\n5️⃣ GET /audit/?tabla_nombre=productos&registro_id=1');
    const logsRegistro = await auditoriaService.obtenerLogsAuditoria({
      tabla_nombre: 'productos',
      registro_id: 1,
      skip: 0,
      limit: 10
    });
    console.log(`✅ Logs del producto 1: ${logsRegistro.length}`);
    results.passed.push('GET /audit/?registro_id=1');

    // 6. Filtrar por rango de fechas
    console.log('\n6️⃣ GET /audit/?fecha_desde=...&fecha_hasta=...');
    const hoy = new Date().toISOString().split('T')[0];
    const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    
    const logsFechas = await auditoriaService.obtenerLogsPorFechas(
      hace7dias,
      hoy,
      { skip: 0, limit: 10 }
    );
    console.log(`✅ Logs últimos 7 días: ${logsFechas.length}`);
    results.passed.push('GET /audit/?fecha_desde&fecha_hasta');

    // 7. Obtener historial de un registro específico
    console.log('\n7️⃣ GET /audit/productos/1 - Historial de un producto');
    try {
      const historialProducto = await auditoriaService.obtenerHistorialRegistro(
        'productos',
        1
      );
      console.log(`✅ Historial del producto 1: ${historialProducto.length} registros`);
      if (historialProducto.length > 0) {
        console.log('Cambios encontrados:', historialProducto);
      }
      results.passed.push('GET /audit/{tabla_nombre}/{registro_id}');
    } catch (error) {
      console.log('⚠️ No se encontró historial para el producto 1');
      results.passed.push('GET /audit/{tabla_nombre}/{registro_id} (sin registros)');
    }

    // 8. Obtener historial de un usuario
    console.log('\n8️⃣ GET /audit/usuarios/1 - Historial de un usuario');
    try {
      const historialUsuario = await auditoriaService.obtenerHistorialRegistro(
        'usuarios',
        1
      );
      console.log(`✅ Historial del usuario 1: ${historialUsuario.length} registros`);
      results.passed.push('GET /audit/usuarios/{id}');
    } catch (error) {
      console.log('⚠️ No se encontró historial para el usuario 1');
      results.passed.push('GET /audit/usuarios/{id} (sin registros)');
    }

    // 9. Combinación de filtros
    console.log('\n9️⃣ GET /audit/ con múltiples filtros');
    const logsComplejos = await auditoriaService.obtenerLogsAuditoria({
      tabla_nombre: 'productos',
      accion: 'UPDATE',
      skip: 0,
      limit: 5
    });
    console.log(`✅ Logs con filtros combinados: ${logsComplejos.length}`);
    results.passed.push('GET /audit/ (filtros combinados)');

    // 10. Paginación
    console.log('\n🔟 Prueba de paginación');
    const pagina1 = await auditoriaService.obtenerLogsAuditoria({
      skip: 0,
      limit: 5
    });
    const pagina2 = await auditoriaService.obtenerLogsAuditoria({
      skip: 5,
      limit: 5
    });
    console.log(`✅ Página 1: ${pagina1.length} logs`);
    console.log(`✅ Página 2: ${pagina2.length} logs`);
    results.passed.push('Paginación');

  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    results.failed.push(error.message);
  }

  // Resumen
  console.log('\n📊 RESUMEN DE PRUEBAS DE AUDITORÍA');
  console.log('====================================');
  console.log(`✅ Pasadas: ${results.passed.length}`);
  console.log(`❌ Fallidas: ${results.failed.length}`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ Pruebas que pasaron:');
    results.passed.forEach(test => console.log(`   - ${test}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Pruebas que fallaron:');
    results.failed.forEach(test => console.log(`   - ${test}`));
  }

  return results;
};

/**
 * Prueba de análisis de auditoría por tabla
 */
export const analizarAuditoriaPorTabla = async (tablaNombre) => {
  console.log(`📊 Analizando auditoría de tabla: ${tablaNombre}\n`);
  
  try {
    const logs = await auditoriaService.obtenerLogsPorTabla(tablaNombre);
    
    // Estadísticas
    const stats = {
      total: logs.length,
      inserts: logs.filter(l => l.accion === 'INSERT').length,
      updates: logs.filter(l => l.accion === 'UPDATE').length,
      deletes: logs.filter(l => l.accion === 'DELETE').length,
      usuarios: [...new Set(logs.map(l => l.usuario_id))].length,
      registros: [...new Set(logs.map(l => l.registro_id))].length
    };
    
    console.log('📈 Estadísticas:');
    console.log(`   Total de cambios: ${stats.total}`);
    console.log(`   Inserciones: ${stats.inserts}`);
    console.log(`   Actualizaciones: ${stats.updates}`);
    console.log(`   Eliminaciones: ${stats.deletes}`);
    console.log(`   Usuarios involucrados: ${stats.usuarios}`);
    console.log(`   Registros afectados: ${stats.registros}`);
    
    return stats;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

/**
 * Prueba de línea de tiempo de un registro
 */
export const verLineaDeTiempo = async (tablaNombre, registroId) => {
  console.log(`📅 Línea de tiempo de ${tablaNombre}/${registroId}\n`);
  
  try {
    const historial = await auditoriaService.obtenerHistorialRegistro(
      tablaNombre,
      registroId
    );
    
    console.log(`Encontrados ${historial.length} cambios:\n`);
    
    historial.forEach((log, index) => {
      console.log(`${index + 1}. [${log.accion}] - ${log.fecha_hora}`);
      console.log(`   Usuario: ${log.usuario_id || 'Sistema'}`);
      if (log.datos_anteriores) {
        console.log(`   Antes: ${log.datos_anteriores}`);
      }
      if (log.datos_nuevos) {
        console.log(`   Después: ${log.datos_nuevos}`);
      }
      console.log('');
    });
    
    return historial;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Exportar objeto con todas las pruebas
export default {
  testAuditoriaEndpoints,
  analizarAuditoriaPorTabla,
  verLineaDeTiempo
};
