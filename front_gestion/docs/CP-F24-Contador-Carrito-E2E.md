# CP-F24 - Icono y Contador de Carrito - Prueba E2E

## Información General

- **Código de Caso de Prueba**: CP-F24
- **Nombre**: Icono y contador de carrito en encabezado
- **Tipo de Prueba**: End-to-End Test (Solo E2E)
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción del Caso de Prueba

Comprobar que el icono de carrito se muestra en el header con un contador de ítems actualizado. Esta prueba valida:
- Visibilidad del botón de carrito
- Actualización del contador al agregar productos
- Actualización del contador al eliminar productos
- Persistencia del contador al navegar entre páginas
- Ocultamiento del contador cuando el carrito está vacío

---

## ⚠️ ¿Por Qué NO se Implementa Prueba Unitaria?

### Razón Principal: Integración de Estado Global y UI

El contador del carrito depende del estado global (`useCart`) y su integración con el componente `Header`.

#### Análisis del Componente

```javascript
// Header.js
const { itemCount } = useCart();

// ...

<button className="header-btn" onClick={() => navigate('/carrito')}>
  Carrito {itemCount > 0 && `(${itemCount})`}
</button>
```

### ¿Qué hace el componente?

| Acción | Responsable | ¿Se puede probar unitariamente? |
|--------|-------------|--------------------------------|
| Obtener itemCount | **Context API** (`useCart`) | ✅ Sí, testeando el hook |
| Renderizar botón | **React** | ✅ Sí, con renderizado condicional |
| Actualizar al agregar | **Integración** | ❌ No, requiere interacción real |
| Persistir al navegar | **Integración** | ❌ No, requiere navegación real |

### ¿Por Qué NO Hacer Prueba Unitaria?

| Razón | Explicación |
|-------|-------------|
| **Dependencia de Contexto** | Requiere mockear todo el `CartProvider` |
| **Validación Visual** | Lo importante es que el usuario *vea* el número correcto |
| **Integración Real** | Validamos que `Agregar -> Contexto -> Header` funciona |
| **E2E es más robusto** | Valida el flujo completo de actualización |

---

## Tipo de Prueba Implementada

### Prueba E2E con Playwright

**Archivo**: `e2e/CP-F24-contador-carrito.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Actualización Dinámica ✅

**Descripción**: Verificar que el contador se actualiza al agregar y eliminar productos.

**Pasos**:
1. Verificar estado inicial (sin contador)
2. Agregar 1 producto → Verificar `(1)`
3. Agregar otro producto → Verificar `(2)`
4. Eliminar 1 producto → Verificar `(1)`

**Resultado esperado**: El contador refleja exactamente la cantidad de items únicos en el carrito.

---

### Test 2: Persistencia en Navegación ✅

**Descripción**: Verificar que el contador persiste al navegar entre páginas.

**Pasos**:
1. Agregar producto (contador = 1)
2. Ir a Home → Verificar `(1)`
3. Ir a Mi Cuenta → Verificar `(1)`
4. Ir a Categoría → Verificar `(1)`

**Resultado esperado**: El contador no se pierde al cambiar de ruta.

---

## Comandos de Ejecución

```bash
# Ejecutar solo CP-F24
npx playwright test e2e/CP-F24-contador-carrito.spec.js

# Modo headed (ver el navegador)
npx playwright test e2e/CP-F24-contador-carrito.spec.js --headed

# Modo debug (paso a paso)
npx playwright test e2e/CP-F24-contador-carrito.spec.js --debug

# Ejecutar todas las pruebas E2E
npm run test:e2e
```

---

## Resultado Esperado

```
Running 2 tests using 1 worker

  ✓  CP-F24 - Icono y contador de carrito › Verificar que el contador se actualiza... (5.2s)
  ✓  CP-F24 - Icono y contador de carrito › Verificar que el contador persiste... (3.8s)

  2 passed (9.0s)
```

---

## Validaciones Realizadas

| # | Validación | Estado | Descripción |
|---|------------|--------|-------------|
| 1 | Estado inicial vacío | ✅ | No muestra `(0)` ni paréntesis |
| 2 | Incremento a 1 | ✅ | Muestra `(1)` al agregar primer item |
| 3 | Incremento a 2 | ✅ | Muestra `(2)` al agregar segundo item |
| 4 | Decremento a 1 | ✅ | Muestra `(1)` al eliminar un item |
| 5 | Persistencia | ✅ | Se mantiene al navegar |

---

## Screenshots Generados

La prueba genera automáticamente:

1. **`e2e/screenshots/CP-F24-contador-1.png`**  
   Header con contador en (1)

2. **`e2e/screenshots/CP-F24-contador-2.png`**  
   Header con contador en (2)

3. **`e2e/screenshots/CP-F24-contador-eliminar.png`**  
   Header con contador actualizado tras eliminar

---

## Flujo de la Prueba

```mermaid
graph TD
    A[Inicio] --> B{¿Carrito vacío?}
    B -->|Sí| C[No mostrar contador]
    B -->|No| D[Mostrar (N)]
    C --> E[Agregar Producto]
    E --> F[Actualizar Contexto]
    F --> G[Header se renderiza]
    G --> H[Mostrar (1)]
    H --> I[Eliminar Producto]
    I --> J[Mostrar (0) -> Ocultar]
```

---

## Selectores Utilizados

```javascript
// Botón Carrito
'button:has-text("Carrito")'

// Validación de texto
.toContainText('(1)')
.not.toContainText('(')
```

---

## Lo que SÍ Cubre

✅ Visibilidad del contador  
✅ Actualización en tiempo real  
✅ Sincronización con acciones de agregar/eliminar  
✅ Persistencia entre rutas  

---

## Lo que NO Cubre

❌ Animación del contador (si existiera)  
❌ Límite máximo de visualización (ej. 99+)  
❌ Actualización desde otras pestañas (storage event)  

---

## Debugging

### Si la prueba falla:

1. **Verificar que el servidor está corriendo**:
   ```bash
   npm start
   ```

2. **Verificar que el usuario está logueado**:
   El botón de carrito solo aparece para usuarios autenticados.

3. **Ver screenshots**:
   - `e2e/screenshots/CP-F24-contador-1.png`

4. **Ejecutar en modo headed**:
   ```bash
   npx playwright test e2e/CP-F24-contador-carrito.spec.js --headed
   ```

---

## Conclusión

La prueba E2E CP-F24 valida exitosamente que el contador del carrito en el header funciona correctamente, proporcionando feedback visual esencial para el usuario.

**No se implementa prueba unitaria** porque la funcionalidad depende de la integración entre el contexto global del carrito y el componente visual, lo cual se valida mejor con una prueba E2E que simule el flujo real del usuario.

---

**Última actualización**: 2025-11-26  
**Autor**: Equipo Frontend  
**Tipo de prueba**: E2E (Playwright)  
**Nota**: No se implementa prueba unitaria porque depende de integración de contexto
