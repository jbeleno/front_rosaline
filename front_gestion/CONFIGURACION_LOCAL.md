# 🚀 Configuración para Ejecución Local

## ✅ Dependencias Instaladas

Las dependencias ya están instaladas. Puedes ejecutar el proyecto ahora.

## 📋 Configuración de Variables de Entorno

Necesitas crear un archivo `.env.local` en el directorio `front_gestion/` con las siguientes variables:

### Crear archivo `.env.local`

```bash
# En el directorio front_gestion/
```

Contenido del archivo `.env.local`:

```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase_aqui
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

**Nota**: Si no tienes credenciales de Supabase, puedes dejar valores vacíos temporalmente, pero algunas funcionalidades no funcionarán.

## 🏃 Ejecutar el Proyecto

### Desarrollo Local

```bash
npm start
```

Esto iniciará el servidor de desarrollo en `http://localhost:3000`

### Endpoints del Backend

El backend API ya está configurado para apuntar a:
- **URL Base**: `http://3.137.201.203`

Los endpoints disponibles son:
- `GET /productos/` - Lista de productos
- `GET /productos/:id` - Detalle de producto
- `GET /categorias/` - Lista de categorías
- `GET /categorias/:id/productos` - Productos por categoría
- `POST /login` - Iniciar sesión
- `POST /usuarios/` - Registrar usuario
- `POST /clientes/` - Crear cliente
- `GET /clientes/usuario/:id` - Obtener cliente por usuario
- `GET /clientes/:id/carritos` - Obtener carritos del cliente
- `POST /carritos/` - Crear carrito
- `GET /detalle_carrito/` - Obtener detalles del carrito
- `POST /detalle_carrito/` - Agregar producto al carrito
- `PUT /detalle_carrito/:id` - Actualizar detalle del carrito
- `DELETE /detalle_carrito/:id` - Eliminar producto del carrito
- `POST /pedidos/` - Crear pedido
- `GET /pedidos/` - Lista de pedidos
- `GET /pedidos/:id` - Detalle de pedido

## 🧪 Probar Endpoints

### Usando curl (línea de comandos)

```bash
# Obtener productos
curl http://3.137.201.203/productos/

# Obtener categorías
curl http://3.137.201.203/categorias/

# Obtener producto específico (ejemplo ID 1)
curl http://3.137.201.203/productos/ | grep -A 10 "id_producto"
```

### Usando el navegador

Simplemente abre en tu navegador:
- `http://3.137.201.203/productos/`
- `http://3.137.201.203/categorias/`

### Usando Postman o Insomnia

1. Crea una nueva petición GET
2. URL: `http://3.137.201.203/productos/`
3. Headers: `Content-Type: application/json`
4. Envía la petición

## 🔍 Verificar que el Backend Funciona

Abre esta URL en tu navegador para verificar:
```
http://3.137.201.203/productos/
```

Deberías ver un JSON con la lista de productos.

## ⚠️ Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "Network request failed"
- Verifica que el backend esté funcionando: `http://3.137.201.203/productos/`
- Verifica tu conexión a internet
- Si el backend está en Render, puede tardar unos segundos en "despertar" la primera vez

### Error: Supabase no configurado
- Crea el archivo `.env.local` con las credenciales de Supabase
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

## 📝 Notas Importantes

1. **El archivo `.env.local` NO se sube a Git** (está en .gitignore)
2. **Reinicia el servidor** después de modificar variables de entorno
3. **El backend en Render** puede tardar unos segundos en responder la primera vez después de un período de inactividad
4. **Hot reload**: Los cambios en el código se reflejan automáticamente en el navegador

## 🎯 Próximos Pasos

1. Crea el archivo `.env.local` con tus credenciales de Supabase
2. Ejecuta `npm start`
3. Abre `http://localhost:3000` en tu navegador
4. Prueba los endpoints del backend usando las herramientas mencionadas arriba

