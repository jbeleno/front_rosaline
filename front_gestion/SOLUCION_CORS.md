# 🔧 Solución al Error CORS

## 🚨 Problema Detectado

El navegador está bloqueando las peticiones desde `http://localhost:3000` hacia `https://api.rosalinebakery.me/carritos/` por políticas CORS (Cross-Origin Resource Sharing).

**Error exacto:**
```
Access to fetch at 'https://api.rosalinebakery.me/carritos/' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## ✅ Solución en el Backend (FastAPI)

El backend necesita configurar CORS para permitir peticiones desde `http://localhost:3000`.

### Opción 1: Configuración Básica (Desarrollo)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://rosalinebakery.me",
    "https://www.rosalinebakery.me",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)
```

### Opción 2: Configuración Completa (Producción)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Determinar orígenes según el entorno
if os.getenv("ENVIRONMENT") == "production":
    origins = [
        "https://rosalinebakery.me",
        "https://www.rosalinebakery.me",
    ]
else:
    origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["Content-Length", "X-Total-Count"],
    max_age=600,  # Cache preflight requests por 10 minutos
)
```

---

## 🔍 Verificar la Configuración Actual

Para verificar si CORS está configurado en el backend, ejecuta en PowerShell:

```powershell
curl -I -X OPTIONS https://api.rosalinebakery.me/carritos/ `
  -H "Origin: http://localhost:3000" `
  -H "Access-Control-Request-Method: GET"
```

**Respuesta esperada:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 🛠️ Solución Temporal (Solo para Desarrollo)

Mientras se configura el backend, puedes usar un proxy en el frontend:

### 1. Actualizar `package.json`

Agrega esta línea en `front_gestion/package.json`:

```json
{
  "name": "front_gestion",
  "version": "0.1.0",
  "proxy": "https://api.rosalinebakery.me",
  ...
}
```

### 2. Actualizar `apiClient.js`

```javascript
// En lugar de usar la URL completa
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.rosalinebakery.me'
  : ''; // Usa el proxy en desarrollo
```

**⚠️ IMPORTANTE:** Esta es solo una solución temporal. La configuración correcta debe hacerse en el backend.

---

## 📋 Checklist para el Equipo Backend

- [ ] Agregar `CORSMiddleware` a FastAPI
- [ ] Incluir `http://localhost:3000` en `allow_origins`
- [ ] Habilitar `allow_credentials=True`
- [ ] Permitir métodos: GET, POST, PUT, DELETE, OPTIONS
- [ ] Permitir headers: Content-Type, Authorization
- [ ] Reiniciar el servidor backend
- [ ] Verificar con curl que CORS está funcionando

---

## 🎯 Mejoras Implementadas en el Frontend

Mientras tanto, he mejorado el componente `ProductosList.js`:

1. ✅ **Mejor manejo de imágenes**: Validación de URLs antes de renderizar
2. ✅ **Estado de errores**: Tracking de imágenes que fallan al cargar
3. ✅ **Lazy loading**: Carga diferida de imágenes para mejor rendimiento
4. ✅ **Placeholder mejorado**: Ícono y diseño más atractivo cuando no hay imagen
5. ✅ **Validación de URLs**: Verifica que sean URLs válidas antes de usarlas

---

## 🧪 Probar Después de Configurar CORS

Una vez que el backend tenga CORS configurado:

1. Refresca la página (Ctrl + F5)
2. Intenta agregar un producto al carrito
3. Verifica en la consola que no hay errores CORS
4. Las peticiones a `/carritos/` deberían funcionar correctamente

---

## 📞 Contacto con Backend

**Mensaje para el equipo de backend:**

> Hola equipo, necesitamos habilitar CORS en la API para permitir peticiones desde `http://localhost:3000`. 
> 
> Específicamente, los endpoints de `/carritos/` y `/detalle_carrito/` están siendo bloqueados.
> 
> Por favor, agreguen la configuración de `CORSMiddleware` en FastAPI según el ejemplo en este documento.
> 
> Gracias!

---

## 🚀 Estado Actual

- ✅ Frontend implementado correctamente
- ✅ Servicios de carrito creados
- ✅ Manejo de imágenes mejorado
- ⏳ **Esperando configuración CORS en backend**
- ⏳ Prueba completa del flujo de carrito

