# 🔧 Conflicto de Rutas en Endpoints de Usuarios

## 🚨 Problema Detectado

Existe un conflicto entre dos endpoints de usuarios:

1. `GET /usuarios/me` - Obtener usuario autenticado
2. `GET /usuarios/{usuario_id}` - Obtener usuario por ID

### Causa del Conflicto

En FastAPI (y la mayoría de frameworks), las rutas se evalúan **en el orden en que se definen**. Si `GET /usuarios/{usuario_id}` está definida ANTES que `GET /usuarios/me`, cuando se hace una petición a `/usuarios/me`, el router interpreta "me" como un `usuario_id` e intenta buscar un usuario con ID "me", causando errores.

---

## ✅ Solución en el Backend (FastAPI)

### Orden Correcto de las Rutas

Las rutas **específicas** deben ir **ANTES** de las rutas con **parámetros**:

```python
# ✅ CORRECTO - Ruta específica primero
@app.get("/usuarios/me")
async def get_current_user(current_user: dict = Depends(get_current_user)):
    """Obtener información del usuario autenticado actual"""
    return {
        "sub": current_user["sub"],
        "id_usuario": current_user["id_usuario"],
        "rol": current_user["rol"]
    }

# Ruta con parámetro después
@app.get("/usuarios/{usuario_id}")
async def get_usuario_by_id(
    usuario_id: int, 
    current_user: dict = Depends(require_admin)
):
    """Obtener usuario específico por ID (Solo Admin/Super Admin)"""
    usuario = await db.usuarios.get(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {
        "id_usuario": usuario.id_usuario,
        "correo": usuario.correo,
        "rol": usuario.rol,
        "fecha_creacion": usuario.fecha_creacion,
        "email_verificado": usuario.email_verificado
    }
```

```python
# ❌ INCORRECTO - Ruta con parámetro primero
@app.get("/usuarios/{usuario_id}")  # ← Esta capturará también /usuarios/me
async def get_usuario_by_id(...):
    ...

@app.get("/usuarios/me")  # ← Nunca se alcanzará
async def get_current_user(...):
    ...
```

---

## 🎯 Diferencias entre los Endpoints

### `GET /usuarios/me`
- **Propósito**: Obtener datos del usuario que inició sesión
- **Autenticación**: JWT del usuario autenticado
- **Quién puede usarlo**: Cualquier usuario autenticado
- **Respuesta**:
```json
{
  "sub": "usuario@ejemplo.com",
  "id_usuario": 1,
  "rol": "cliente"
}
```

### `GET /usuarios/{usuario_id}`
- **Propósito**: Obtener datos de cualquier usuario por ID (admin)
- **Autenticación**: JWT + permisos de Admin/Super Admin
- **Quién puede usarlo**: Solo administradores
- **Parámetros**: `usuario_id` (int)
- **Respuesta**:
```json
{
  "id_usuario": 1,
  "correo": "usuario@ejemplo.com",
  "rol": "admin",
  "fecha_creacion": "2024-11-20T18:00:00",
  "email_verificado": "S"
}
```

---

## 🔍 Validación Adicional en Frontend

He agregado validación en el frontend para prevenir intentos de usar "me" como ID:

```javascript
const handleCargarUsuario = async () => {
  // Validar que el ID sea un número y no sea "me"
  const userId = usuarioData.id.trim();
  if (userId.toLowerCase() === 'me' || isNaN(userId)) {
    setErrorMessage('El ID del usuario debe ser un número válido');
    return;
  }
  
  // Llamar a GET /usuarios/{usuario_id}
  const usuario = await apiClient.get(API_ENDPOINTS.USUARIO_BY_ID(userId));
}
```

---

## 🧪 Cómo Verificar que Está Solucionado

### 1. Probar `/usuarios/me`
```bash
curl -X GET "https://api.rosalinebakery.me/usuarios/me" \
  -H "Authorization: Bearer {token}"
```

**Respuesta esperada**: Datos del usuario autenticado

### 2. Probar `/usuarios/{id}`
```bash
curl -X GET "https://api.rosalinebakery.me/usuarios/1" \
  -H "Authorization: Bearer {admin_token}"
```

**Respuesta esperada**: Datos del usuario con ID 1

### 3. Verificar que "me" no se interpreta como ID
```bash
curl -X GET "https://api.rosalinebakery.me/usuarios/me" \
  -H "Authorization: Bearer {token}"
```

**NO debe retornar**: Error de "Usuario con ID 'me' no encontrado"

---

## 📋 Checklist para el Backend

- [ ] Verificar orden de las rutas en el archivo de rutas de usuarios
- [ ] Colocar `@app.get("/usuarios/me")` ANTES de `@app.get("/usuarios/{usuario_id}")`
- [ ] Agregar validación en `/usuarios/{usuario_id}` para asegurar que `usuario_id` es un entero
- [ ] Probar ambos endpoints con las peticiones de arriba
- [ ] Confirmar que no hay conflicto de rutas

---

## 💡 Regla General en FastAPI

**Siempre definir rutas de más específica a más general:**

```python
# ✅ Orden correcto
/usuarios/me              # Específica
/usuarios/stats           # Específica
/usuarios/{id}/profile    # Semi-específica
/usuarios/{id}            # General (parámetro)

# ❌ Orden incorrecto
/usuarios/{id}            # Capturará todo
/usuarios/me              # Nunca se alcanzará
```

---

## 📞 Contacto

Si el problema persiste después de reorganizar las rutas, verificar:

1. **Cache de FastAPI**: Reiniciar el servidor completamente
2. **APIRouter**: Si se usa APIRouter, verificar el orden al incluir los routers
3. **Prioridad de rutas**: FastAPI respeta el orden de definición estrictamente

---

**Estado**: ⏳ Esperando corrección en backend
**Prioridad**: 🔴 Alta - Bloquea funcionalidad de administración de usuarios
