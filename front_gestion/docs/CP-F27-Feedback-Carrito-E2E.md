# CP-F27 - Feedback Visual al Agregar al Carrito - Prueba E2E

## Información General

- **Código de Caso de Prueba**: CP-F27
- **Nombre**: Feedback visual al agregar al carrito
- **Tipo de Prueba**: End-to-End Test (Solo E2E)
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción del Caso de Prueba

Comprobar que el usuario recibe un feedback visual inmediato (notificación tipo Toast) al agregar un producto al carrito, tanto desde el listado general como desde la vista de detalle. Esto es crucial para confirmar al usuario que su acción fue exitosa sin necesidad de recargar la página o ir al carrito.

---

## ⚠️ ¿Por Qué NO se Implementa Prueba Unitaria?

### Razón Principal: Validación de UX y Librerías de Terceros

El feedback visual depende de:
1.  **Integración con `react-toastify`**: Verificar que la librería se dispara correctamente.
2.  **Visibilidad en el DOM**: Confirmar que el mensaje realmente aparece sobre la interfaz.
3.  **Timing**: El mensaje debe aparecer y desaparecer (o quedarse el tiempo suficiente).

Una prueba unitaria podría mockear `toast.success`, pero no garantizaría que el usuario final realmente vea el mensaje en la pantalla (por ejemplo, si el `ToastContainer` no está montado en `App.js` o tiene un z-index incorrecto).

---

## Tipo de Prueba Implementada

### Prueba E2E con Playwright

**Archivo**: `e2e/CP-F27-feedback-carrito.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Feedback desde Detalle ✅

**Descripción**: Verificar Toast al agregar desde la vista individual del producto.

**Pasos**:
1. Navegar a un producto.
2. Clic en "Agregar al carrito".
3. Esperar aparición de `.Toastify__toast--success`.
4. Validar texto: "¡Producto añadido al carrito!".

**Resultado esperado**: Notificación verde visible.

---

### Test 2: Feedback desde Listado ✅

**Descripción**: Verificar Toast al agregar desde el catálogo general (`/productos`).

**Pasos**:
1. Ir a `/productos`.
2. Clic en el botón de carrito de una tarjeta.
3. Esperar aparición de `.Toastify__toast--success`.
4. Validar texto (contiene "agregado al carrito").

**Resultado esperado**: Notificación verde visible con el nombre del producto.

---

## Comandos de Ejecución

```bash
# Ejecutar solo CP-F27
npx playwright test e2e/CP-F27-feedback-carrito.spec.js

# Modo headed
npx playwright test e2e/CP-F27-feedback-carrito.spec.js --headed
```

---

## Resultado Esperado

```
Running 2 tests using 1 worker

  ✓  CP-F27 - Feedback visual... › Verificar feedback... desde Detalle... (4.2s)
  ✓  CP-F27 - Feedback visual... › Verificar feedback... desde Listado... (3.5s)

  2 passed (7.7s)
```

---

## Validaciones Realizadas

| # | Validación | Estado | Descripción |
|---|------------|--------|-------------|
| 1 | Aparición del Toast | ✅ | El elemento Toastify aparece en el DOM |
| 2 | Estilo de Éxito | ✅ | Tiene la clase de éxito (color verde) |
| 3 | Contenido del Mensaje | ✅ | El texto confirma la acción |
| 4 | No Bloqueo | ✅ | La interfaz sigue usable |

---

## Screenshots Generados

1. **`e2e/screenshots/CP-F27-feedback-detalle.png`**
2. **`e2e/screenshots/CP-F27-feedback-listado.png`**

---

## Flujo de la Prueba

```mermaid
graph TD
    A[Usuario hace Clic en Agregar] --> B[Llamada a API (useCart)]
    B --> C{Éxito?}
    C -- Sí --> D[Disparar toast.success()]
    D --> E[ToastContainer renderiza mensaje]
    E --> F[Usuario ve confirmación visual]
```

---

## Conclusión

La prueba E2E CP-F27 valida exitosamente que el sistema comunica de manera efectiva las acciones del usuario, mejorando la experiencia de compra y reduciendo la incertidumbre.

---

**Última actualización**: 2025-11-26  
**Autor**: Equipo Frontend  
**Tipo de prueba**: E2E (Playwright)
