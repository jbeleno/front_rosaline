# CP-F26 - Navegación de Tarjeta a Detalle - Prueba E2E

## Información General

- **Código de Caso de Prueba**: CP-F26
- **Nombre**: Navegación de tarjeta de producto a detalle
- **Tipo de Prueba**: End-to-End Test (Solo E2E)
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción del Caso de Prueba

Verificar que al hacer clic en una tarjeta de producto se navega correctamente a la página de detalle. Esta prueba valida el flujo fundamental de navegación para ver más información de un producto antes de comprarlo.

---

## ⚠️ ¿Por Qué NO se Implementa Prueba Unitaria?

### Razón Principal: Validación de Routing y Navegación

La navegación implica:
1.  **Router**: Cambio de URL (`react-router-dom`).
2.  **Paso de Parámetros**: El ID del producto debe pasar correctamente en la URL.
3.  **Carga de Componente**: El componente `VistaProducto` debe montarse y cargar la data correcta basada en el ID.

Una prueba unitaria del componente `ProductoCard` solo validaría que se llama a `navigate()`, pero no si la ruta destino existe, si carga el componente correcto o si la información se muestra bien.

---

## Tipo de Prueba Implementada

### Prueba E2E con Playwright

**Archivo**: `e2e/CP-F26-navegacion-detalle.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Navegación desde Home ✅

**Descripción**: Verificar navegación desde el listado principal (Home) a la vista de detalle.

**Pasos**:
1. Identificar tarjeta de producto "Oreo".
2. Capturar nombre del producto.
3. Hacer clic en la tarjeta.
4. Verificar URL (`/producto/:id`).
5. Verificar que el título en detalle coincide con el de la tarjeta.
6. Verificar presencia de precio, descripción y botón de compra.

**Resultado esperado**: Navegación fluida y carga correcta de datos.

---

### Test 2: Navegación desde Categoría ✅

**Descripción**: Verificar navegación tras aplicar un filtro de categoría.

**Pasos**:
1. Filtrar por categoría "Tradicional".
2. Clic en el primer producto resultante.
3. Verificar URL y consistencia de datos.

**Resultado esperado**: La navegación funciona igual de bien desde una lista filtrada.

---

## Comandos de Ejecución

```bash
# Ejecutar solo CP-F26
npx playwright test e2e/CP-F26-navegacion-detalle.spec.js

# Modo headed
npx playwright test e2e/CP-F26-navegacion-detalle.spec.js --headed
```

---

## Resultado Esperado

```
Running 3 tests using 1 worker

  ✓  CP-F26 - Navegación de tarjeta... › Verificar navegación desde Home... (3.5s)
  ✓  CP-F26 - Navegación de tarjeta... › Verificar navegación desde Categoría... (2.8s)
  ✓  CP-F26 - Navegación de tarjeta... › Verificar botón de volver... (1.2s)

  3 passed (7.5s)
```

---

## Validaciones Realizadas

| # | Validación | Estado | Descripción |
|---|------------|--------|-------------|
| 1 | Cambio de URL | ✅ | URL cambia a `/producto/{id}` |
| 2 | Consistencia de Datos | ✅ | Título en lista == Título en detalle |
| 3 | Renderizado de Detalle | ✅ | Se muestran precio, descripción y botón |
| 4 | Interacción | ✅ | El clic en toda la tarjeta funciona |

---

## Screenshots Generados

1. **`e2e/screenshots/CP-F26-detalle-producto.png`**

---

## Flujo de la Prueba

```mermaid
graph TD
    A[Home / Lista] --> B[Clic en Tarjeta Producto]
    B --> C{Router}
    C --> D[Cambio de URL /producto/:id]
    D --> E[Montar VistaProducto]
    E --> F[Fetch Detalles (si aplica)]
    F --> G[Mostrar Título, Precio, Desc]
```

---

## Conclusión

La prueba E2E CP-F26 valida exitosamente que los usuarios pueden navegar intuitivamente desde el listado de productos a la vista detallada, asegurando que el enrutamiento y el paso de parámetros funcionan correctamente.

---

**Última actualización**: 2025-11-26  
**Autor**: Equipo Frontend  
**Tipo de prueba**: E2E (Playwright)
