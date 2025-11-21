# 🛒 Endpoints de Carritos - Documentación de Implementación

## 📋 Resumen

Se han implementado **todos los endpoints** de Carritos y Detalles de Carrito según la especificación de la API.

---

## 📁 Archivos Creados

### 1. **carritoService.js**
Servicio para gestión de carritos de compra.

**Funciones disponibles:**
- `crearCarrito(carritoData)` - POST /carritos/
- `obtenerCarritos(params)` - GET /carritos/ (Solo Admin)
- `obtenerCarritoPorId(carritoId)` - GET /carritos/{carrito_id}
- `obtenerProductosDeCarrito(carritoId)` - GET /carritos/{carrito_id}/productos
- `actualizarCarrito(carritoId, carritoData)` - PUT /carritos/{carrito_id}
- `eliminarCarrito(carritoId)` - DELETE /carritos/{carrito_id}
- `obtenerCarritosPorCliente(clienteId)` - GET /clientes/{cliente_id}/carritos

### 2. **detalleCarritoService.js**
Servicio para gestión de productos en el carrito.

**Funciones disponibles:**
- `agregarProductoAlCarrito(detalleData)` - POST /detalle_carrito/
- `obtenerDetallesCarrito(params)` - GET /detalle_carrito/ (Solo Admin)
- `obtenerDetallePorId(detalleId)` - GET /detalle_carrito/{detalle_id}
- `actualizarDetalleCarrito(detalleId, detalleData)` - PUT /detalle_carrito/{detalle_id}
- `eliminarProductoDelCarrito(detalleId)` - DELETE /detalle_carrito/{detalle_id}

### 3. **cartStore.js** (Actualizado)
Store de Zustand actualizado para usar los nuevos servicios.

### 4. **testCarritos.js**
Archivo de pruebas completo para validar todos los endpoints.

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Desde la Consola del Navegador

```javascript
// Importar las pruebas
import { testCarritosEndpoints, testCarritosPorCliente } from './shared/services/api/testCarritos';

// Ejecutar todas las pruebas
await testCarritosEndpoints();

// Probar obtener carritos de un cliente específico
await testCarritosPorCliente(1);
```

### Opción 2: Usar la Aplicación Directamente

1. **Iniciar sesión** como cliente
2. **Navegar a Productos** (`/productos`)
3. **Agregar productos al carrito** - Esto creará automáticamente:
   - Un carrito activo (si no existe)
   - Detalles de carrito con los productos seleccionados
4. **Ver carrito** (`/carrito`)
5. **Modificar cantidades** - Actualiza los detalles
6. **Eliminar productos** - Elimina detalles específicos

---

## 📊 Endpoints Implementados

### Carritos (10 endpoints)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/carritos/` | Crear carrito | Cliente/Admin |
| GET | `/carritos/` | Listar todos los carritos | Admin |
| GET | `/carritos/{carrito_id}` | Obtener carrito por ID | Dueño/Admin |
| GET | `/carritos/{carrito_id}/productos` | Obtener productos del carrito | Dueño/Admin |
| PUT | `/carritos/{carrito_id}` | Actualizar carrito | Dueño/Admin |
| DELETE | `/carritos/{carrito_id}` | Eliminar carrito | Dueño/Admin |
| GET | `/clientes/{cliente_id}/carritos` | Obtener carritos de un cliente | Dueño/Admin |

### Detalles de Carrito (5 endpoints)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/detalle_carrito/` | Agregar producto al carrito | Cliente/Admin |
| GET | `/detalle_carrito/` | Listar todos los detalles | Admin |
| GET | `/detalle_carrito/{detalle_id}` | Obtener detalle por ID | Dueño/Admin |
| PUT | `/detalle_carrito/{detalle_id}` | Actualizar detalle | Dueño/Admin |
| DELETE | `/detalle_carrito/{detalle_id}` | Eliminar producto del carrito | Dueño/Admin |

---

## 💡 Flujo de Uso del Carrito

### 1. Crear Carrito
```javascript
import carritoService from './shared/services/api/carritoService';

const carrito = await carritoService.crearCarrito({
  id_cliente: 1,
  estado: 'activo'
});
```

### 2. Agregar Producto al Carrito
```javascript
import detalleCarritoService from './shared/services/api/detalleCarritoService';

const detalle = await detalleCarritoService.agregarProductoAlCarrito({
  id_carrito: carrito.id_carrito,
  id_producto: 1,
  cantidad: 2,
  precio_unitario: 25.99,
  subtotal: 51.98
});
```

### 3. Obtener Productos del Carrito
```javascript
const productos = await carritoService.obtenerProductosDeCarrito(carrito.id_carrito);
console.log('Productos en el carrito:', productos);
```

### 4. Actualizar Cantidad
```javascript
await detalleCarritoService.actualizarDetalleCarrito(detalle.id_detalle_carrito, {
  id_carrito: carrito.id_carrito,
  id_producto: 1,
  cantidad: 3,
  precio_unitario: 25.99,
  subtotal: 77.97
});
```

### 5. Eliminar Producto del Carrito
```javascript
await detalleCarritoService.eliminarProductoDelCarrito(detalle.id_detalle_carrito);
```

### 6. Eliminar Carrito
```javascript
await carritoService.eliminarCarrito(carrito.id_carrito);
```

---

## 🔒 Validaciones Implementadas

### Carritos
- `id_cliente`: Requerido, debe ser > 0
- `estado`: Opcional, valores permitidos: "activo", "inactivo", "completado"
- Los clientes solo pueden gestionar sus propios carritos
- Los admins pueden gestionar cualquier carrito

### Detalles de Carrito
- `id_carrito`: Requerido, debe ser > 0
- `id_producto`: Requerido, debe ser > 0
- `cantidad`: Requerida, entre 1 y 1000
- `precio_unitario`: Requerido, > 0, máximo 999999.99
- `subtotal`: Debe ser igual a `cantidad × precio_unitario`
- Se valida inventario disponible (no se descuenta hasta crear pedido)

---

## 🎯 Integración con el Store

El `cartStore.js` ha sido actualizado para usar los nuevos servicios:

```javascript
import useCartStore from './features/cart/store/cartStore';

// En tu componente
const { addToCart, removeFromCart, updateItemQuantity, clearCart } = useCartStore();

// Agregar producto
await addToCart(producto, 1, clienteId);

// Actualizar cantidad
await updateItemQuantity(detalleId, 3);

// Eliminar producto
await removeFromCart(detalleId);

// Vaciar carrito
await clearCart();
```

---

## ✅ Estado de Implementación

- ✅ **carritoService.js** - 7 funciones implementadas
- ✅ **detalleCarritoService.js** - 5 funciones implementadas
- ✅ **cartStore.js** - Actualizado con los nuevos servicios
- ✅ **ProductosList.js** - Corregido para usar el carrito correctamente
- ✅ **testCarritos.js** - Suite de pruebas completa

---

## 🚀 Próximos Pasos

Ahora que los endpoints de Carritos están implementados, puedes:

1. ✅ **Probar el carrito** agregando productos desde `/productos`
2. ✅ **Ver el carrito** en `/carrito`
3. ✅ **Modificar cantidades** desde el carrito
4. ⏭️ **Implementar endpoints de Pedidos** para completar el flujo de compra

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints requieren autenticación JWT
2. **Permisos**: Los clientes solo pueden gestionar sus propios carritos
3. **Inventario**: Se valida disponibilidad pero no se descuenta hasta crear el pedido
4. **Estado del Carrito**: Un cliente puede tener varios carritos, pero solo uno "activo" a la vez
5. **Subtotales**: Se calculan automáticamente en el frontend y se validan en el backend

---

## 🐛 Solución de Problemas

### Error: "No se pudo obtener o crear el carrito"
**Solución**: Verifica que el usuario esté autenticado y tenga un `cliente.id_cliente` válido.

### Error: "Error al agregar al carrito"
**Solución**: Asegúrate de pasar el objeto completo del producto y el `clienteId`:
```javascript
addToCart(producto, 1, cliente.id_cliente);
```

### Error 403: "No autorizado"
**Solución**: Verifica que el token JWT esté en localStorage y sea válido.

### Los productos no se muestran en el carrito
**Solución**: Verifica que el endpoint `/carritos/{carrito_id}/productos` esté funcionando correctamente.

---

¡Todos los endpoints de Carritos están listos para usar! 🎉
