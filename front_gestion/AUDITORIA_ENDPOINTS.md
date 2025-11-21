# 📊 Endpoints de Auditoría - Documentación de Implementación

## 📋 Resumen

Se han implementado **todos los endpoints** de Auditoría del sistema. Estos endpoints permiten a los administradores rastrear todos los cambios realizados en la base de datos.

---

## 📁 Archivos Creados

### 1. **auditoriaService.js**
Servicio para gestión de logs de auditoría.

**Funciones disponibles:**
- `obtenerLogsAuditoria(params)` - GET /audit/ con filtros avanzados
- `obtenerHistorialRegistro(tablaNombre, registroId)` - GET /audit/{tabla}/{id}
- `obtenerLogsPorTabla(tablaNombre, params)` - Atajos para filtrar por tabla
- `obtenerLogsPorUsuario(usuarioId, params)` - Atajos para filtrar por usuario
- `obtenerLogsPorAccion(accion, params)` - Atajos para filtrar por acción
- `obtenerLogsPorFechas(desde, hasta, params)` - Atajos para filtrar por fechas

### 2. **Auditoria.js**
Componente React completo con interfaz para visualizar y filtrar logs.

**Características:**
- ✅ Filtros avanzados (tabla, acción, usuario, fechas, registro)
- ✅ Tabla responsive con visualización de datos JSON
- ✅ Paginación
- ✅ Búsqueda en tiempo real
- ✅ Protección de acceso (solo admin/super admin)
- ✅ Códigos de color por tipo de acción (INSERT/UPDATE/DELETE)

### 3. **Auditoria.css**
Estilos completos y responsive para el componente de auditoría.

### 4. **testAuditoria.js**
Suite de pruebas completa para validar todos los endpoints.

---

## 📊 Endpoints Implementados

### 1. GET `/audit/` - Listar logs con filtros

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `skip` | int | No | Registros a saltar (default: 0) |
| `limit` | int | No | Límite de registros (default: 100, máx: 100) |
| `tabla_nombre` | string | No | Filtrar por tabla |
| `registro_id` | int | No | Filtrar por ID de registro |
| `accion` | string | No | Filtrar por acción (INSERT, UPDATE, DELETE) |
| `usuario_id` | int | No | Filtrar por usuario |
| `fecha_desde` | datetime | No | Desde fecha |
| `fecha_hasta` | datetime | No | Hasta fecha |

**Ejemplo de uso:**
```javascript
import auditoriaService from './shared/services/api/auditoriaService';

// Obtener todos los logs
const logs = await auditoriaService.obtenerLogsAuditoria({
  skip: 0,
  limit: 50
});

// Filtrar por tabla
const logsProductos = await auditoriaService.obtenerLogsPorTabla('productos');

// Filtrar por acción
const logsInsert = await auditoriaService.obtenerLogsPorAccion('INSERT');

// Filtrar por usuario
const logsUsuario = await auditoriaService.obtenerLogsPorUsuario(1);

// Filtrar por fechas
const logsRecientes = await auditoriaService.obtenerLogsPorFechas(
  '2024-11-01',
  '2024-11-30'
);

// Filtros combinados
const logsFiltrados = await auditoriaService.obtenerLogsAuditoria({
  tabla_nombre: 'productos',
  accion: 'UPDATE',
  usuario_id: 1,
  fecha_desde: '2024-11-01',
  skip: 0,
  limit: 20
});
```

### 2. GET `/audit/{tabla_nombre}/{registro_id}` - Historial de un registro

**Parámetros de ruta:**
- `tabla_nombre`: Nombre de la tabla (ej: "productos", "usuarios", "pedidos")
- `registro_id`: ID del registro

**Ejemplo de uso:**
```javascript
// Ver historial de un producto
const historialProducto = await auditoriaService.obtenerHistorialRegistro(
  'productos',
  123
);

// Ver historial de un usuario
const historialUsuario = await auditoriaService.obtenerHistorialRegistro(
  'usuarios',
  456
);

// Ver historial de un pedido
const historialPedido = await auditoriaService.obtenerHistorialRegistro(
  'pedidos',
  789
);
```

---

## 🎯 Interfaz de Usuario

### Acceder a la Auditoría

1. **Iniciar sesión** como Admin o Super Admin
2. **Navegar a** `/auditoria`
3. **Usar los filtros** para buscar logs específicos
4. **Ver detalles** de cada cambio en la tabla

### Características de la Interfaz

#### 🔍 **Filtros Disponibles**
- **Tabla**: Seleccionar tabla específica (usuarios, productos, pedidos, etc.)
- **Acción**: INSERT, UPDATE o DELETE
- **ID Registro**: Buscar por ID específico
- **ID Usuario**: Ver acciones de un usuario
- **Rango de Fechas**: Desde/Hasta con selector de fecha y hora

#### 📋 **Tabla de Resultados**
- **ID Auditoría**: Identificador único del log
- **Fecha y Hora**: Timestamp del cambio
- **Tabla**: Badge con nombre de la tabla
- **Registro ID**: ID del registro afectado
- **Acción**: Badge de color (verde=INSERT, naranja=UPDATE, rojo=DELETE)
- **Usuario ID**: Quién realizó el cambio
- **Datos Anteriores**: JSON con valores antes del cambio
- **Datos Nuevos**: JSON con valores después del cambio

#### ⏭️ **Paginación**
- Botones Anterior/Siguiente
- Indicador de página actual
- Configurable (default: 50 registros por página)

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Desde la Interfaz Web

1. Inicia sesión como Admin
2. Ve a `/auditoria`
3. Usa los filtros para buscar logs
4. Observa los resultados en tiempo real

### Opción 2: Desde la Consola del Navegador

```javascript
// Importar las pruebas
import { testAuditoriaEndpoints, analizarAuditoriaPorTabla, verLineaDeTiempo } 
  from './shared/services/api/testAuditoria';

// Ejecutar todas las pruebas
await testAuditoriaEndpoints();

// Analizar auditoría de una tabla específica
await analizarAuditoriaPorTabla('productos');

// Ver línea de tiempo de un registro
await verLineaDeTiempo('productos', 1);
```

---

## 📖 Casos de Uso Comunes

### 1. ¿Quién modificó este producto?
```javascript
const historial = await auditoriaService.obtenerHistorialRegistro('productos', 123);
console.log('Cambios en el producto 123:', historial);
```

### 2. ¿Qué cambios hizo este usuario?
```javascript
const acciones = await auditoriaService.obtenerLogsPorUsuario(5);
console.log('Acciones del usuario 5:', acciones);
```

### 3. ¿Qué se eliminó hoy?
```javascript
const hoy = new Date().toISOString().split('T')[0];
const eliminaciones = await auditoriaService.obtenerLogsAuditoria({
  accion: 'DELETE',
  fecha_desde: hoy
});
console.log('Eliminaciones de hoy:', eliminaciones);
```

### 4. Auditoría completa de pedidos
```javascript
const logspedidos = await auditoriaService.obtenerLogsPorTabla('pedidos', {
  skip: 0,
  limit: 100
});
console.log('Historial de pedidos:', logspedidos);
```

### 5. Cambios en las últimas 24 horas
```javascript
const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const ahora = new Date().toISOString();

const cambiosRecientes = await auditoriaService.obtenerLogsPorFechas(
  hace24h,
  ahora
);
console.log('Cambios en las últimas 24 horas:', cambiosRecientes);
```

---

## 🔒 Seguridad

- ✅ **Solo Admin/Super Admin**: Acceso restringido mediante `requireAdmin={true}`
- ✅ **Autenticación JWT**: Todas las peticiones requieren token válido
- ✅ **Protección de rutas**: El componente verifica permisos antes de renderizar
- ✅ **Validación backend**: El servidor valida permisos en cada endpoint

---

## 📊 Estructura de un Log de Auditoría

```json
{
  "id_auditoria": 123,
  "tabla_nombre": "productos",
  "registro_id": 456,
  "accion": "UPDATE",
  "usuario_id": 1,
  "fecha_hora": "2024-11-20T10:30:00",
  "datos_anteriores": "{\"nombre\": \"Galleta\", \"precio\": 5000}",
  "datos_nuevos": "{\"nombre\": \"Galleta Premium\", \"precio\": 6000}"
}
```

---

## 🎨 Personalización

### Cambiar límite de registros por página

En `Auditoria.js`:
```javascript
const [filtros, setFiltros] = useState({
  // ...
  limit: 100  // Cambiar de 50 a 100
});
```

### Agregar más tablas al filtro

En `Auditoria.js`, sección de filtros:
```jsx
<select name="tabla_nombre">
  <option value="">Todas las tablas</option>
  <option value="mi_nueva_tabla">Mi Nueva Tabla</option>
  {/* ... */}
</select>
```

---

## ✅ Estado de Implementación

- ✅ **auditoriaService.js** - 6 funciones implementadas
- ✅ **Auditoria.js** - Componente completo con filtros y paginación
- ✅ **Auditoria.css** - Estilos responsive
- ✅ **testAuditoria.js** - Suite de pruebas completa
- ✅ **App.js** - Ruta `/auditoria` agregada con protección
- ✅ **endpoints.js** - Endpoints configurados

---

## 🚀 Próximos Pasos

Ahora que tienes Auditoría implementada, puedes:

1. ✅ **Acceder a** `/auditoria` como admin
2. ✅ **Filtrar logs** por tabla, usuario, fecha, etc.
3. ✅ **Ver historial** de cambios de cualquier registro
4. ✅ **Analizar patrones** de uso del sistema
5. ⏭️ **Exportar logs** a CSV/Excel (funcionalidad futura)

---

## 🐛 Solución de Problemas

### Error 403: Acceso denegado
**Solución**: Verifica que estés autenticado como Admin o Super Admin.

### No se muestran logs
**Solución**: Verifica que el backend tenga registros de auditoría. Prueba sin filtros primero.

### Error CORS
**Solución**: El backend debe tener CORS configurado (ver `SOLUCION_CORS.md`).

### Los datos JSON no se muestran bien
**Solución**: Verifica que `datos_anteriores` y `datos_nuevos` sean JSON válidos en el backend.

---

¡Los endpoints de Auditoría están completamente implementados y listos para usar! 🎉
