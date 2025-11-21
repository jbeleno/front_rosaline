/**
 * Archivo de prueba para endpoints de Carritos y Detalles de Carrito
 * Ejecutar después de autenticarse
 */

import carritoService from './carritoService';
import detalleCarritoService from './detalleCarritoService';

/**
 * Prueba completa de endpoints de Carritos
 */
export const testCarritosEndpoints = async () => {
  console.log('🧪 Iniciando pruebas de endpoints de Carritos...\n');
  
  const results = {
    passed: [],
    failed: []
  };

  try {
    // 1. Crear carrito
    console.log('1️⃣ POST /carritos/ - Crear carrito');
    const nuevoCarrito = await carritoService.crearCarrito({
      id_cliente: 1,
      estado: 'activo'
    });
    console.log('✅ Carrito creado:', nuevoCarrito);
    results.passed.push('POST /carritos/');

    const carritoId = nuevoCarrito.id_carrito;

    // 2. Listar todos los carritos (solo admin)
    console.log('\n2️⃣ GET /carritos/ - Listar carritos');
    try {
      const carritos = await carritoService.obtenerCarritos({ skip: 0, limit: 10 });
      console.log(`✅ Carritos obtenidos: ${carritos.length}`);
      results.passed.push('GET /carritos/');
    } catch (error) {
      console.log('⚠️ GET /carritos/ requiere permisos de admin');
      results.failed.push('GET /carritos/ (requiere admin)');
    }

    // 3. Obtener carrito por ID
    console.log('\n3️⃣ GET /carritos/{carrito_id} - Obtener carrito por ID');
    const carritoObtenido = await carritoService.obtenerCarritoPorId(carritoId);
    console.log('✅ Carrito obtenido:', carritoObtenido);
    results.passed.push('GET /carritos/{carrito_id}');

    // 4. Agregar producto al carrito (crear detalle)
    console.log('\n4️⃣ POST /detalle_carrito/ - Agregar producto al carrito');
    const detalleCreado = await detalleCarritoService.agregarProductoAlCarrito({
      id_carrito: carritoId,
      id_producto: 1,
      cantidad: 2,
      precio_unitario: 25.99,
      subtotal: 51.98
    });
    console.log('✅ Producto agregado al carrito:', detalleCreado);
    results.passed.push('POST /detalle_carrito/');

    const detalleId = detalleCreado.id_detalle_carrito;

    // 5. Obtener productos del carrito
    console.log('\n5️⃣ GET /carritos/{carrito_id}/productos - Obtener productos del carrito');
    const productos = await carritoService.obtenerProductosDeCarrito(carritoId);
    console.log(`✅ Productos en el carrito: ${productos.length}`);
    results.passed.push('GET /carritos/{carrito_id}/productos');

    // 6. Actualizar detalle de carrito
    console.log('\n6️⃣ PUT /detalle_carrito/{detalle_id} - Actualizar detalle');
    const detalleActualizado = await detalleCarritoService.actualizarDetalleCarrito(detalleId, {
      id_carrito: carritoId,
      id_producto: 1,
      cantidad: 3,
      precio_unitario: 25.99,
      subtotal: 77.97
    });
    console.log('✅ Detalle actualizado:', detalleActualizado);
    results.passed.push('PUT /detalle_carrito/{detalle_id}');

    // 7. Listar todos los detalles (solo admin)
    console.log('\n7️⃣ GET /detalle_carrito/ - Listar detalles');
    try {
      const detalles = await detalleCarritoService.obtenerDetallesCarrito({ skip: 0, limit: 10 });
      console.log(`✅ Detalles obtenidos: ${detalles.length}`);
      results.passed.push('GET /detalle_carrito/');
    } catch (error) {
      console.log('⚠️ GET /detalle_carrito/ requiere permisos de admin');
      results.failed.push('GET /detalle_carrito/ (requiere admin)');
    }

    // 8. Actualizar carrito
    console.log('\n8️⃣ PUT /carritos/{carrito_id} - Actualizar carrito');
    const carritoActualizado = await carritoService.actualizarCarrito(carritoId, {
      id_cliente: 1,
      estado: 'activo'
    });
    console.log('✅ Carrito actualizado:', carritoActualizado);
    results.passed.push('PUT /carritos/{carrito_id}');

    // 9. Eliminar detalle de carrito
    console.log('\n9️⃣ DELETE /detalle_carrito/{detalle_id} - Eliminar detalle');
    await detalleCarritoService.eliminarProductoDelCarrito(detalleId);
    console.log('✅ Detalle eliminado');
    results.passed.push('DELETE /detalle_carrito/{detalle_id}');

    // 10. Eliminar carrito
    console.log('\n🔟 DELETE /carritos/{carrito_id} - Eliminar carrito');
    await carritoService.eliminarCarrito(carritoId);
    console.log('✅ Carrito eliminado');
    results.passed.push('DELETE /carritos/{carrito_id}');

  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    results.failed.push(error.message);
  }

  // Resumen
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('==================');
  console.log(`✅ Pasadas: ${results.passed.length}`);
  console.log(`❌ Fallidas: ${results.failed.length}`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ Endpoints que pasaron:');
    results.passed.forEach(endpoint => console.log(`   - ${endpoint}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Endpoints que fallaron:');
    results.failed.forEach(endpoint => console.log(`   - ${endpoint}`));
  }

  return results;
};

/**
 * Prueba de obtener carritos por cliente
 */
export const testCarritosPorCliente = async (clienteId) => {
  console.log(`🧪 Probando obtener carritos del cliente ${clienteId}...\n`);
  
  try {
    const carritos = await carritoService.obtenerCarritosPorCliente(clienteId);
    console.log('✅ Carritos del cliente:', carritos);
    return carritos;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Exportar objeto con todas las pruebas
export default {
  testCarritosEndpoints,
  testCarritosPorCliente
};
