# CP-005 y CP-009 - Gestión de Pedidos y Flujo Completo - Prueba E2E

## Información General

- **Códigos de Caso de Prueba**: 
  - **CP-005**: Generación de pedido
  - **CP-009**: Proceso completo de compra (Integración)
- **Nombre**: Flujo Completo de Compra y Pedidos - Prueba E2E
- **Tipo de Prueba**: End-to-End Test
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción

Esta prueba es la más crítica del sistema, ya que valida el **flujo completo de integración (CP-009)** que un usuario realiza para comprar, culminando en la generación del pedido (CP-005).

---

## Ubicación del Archivo

**Archivo de prueba**: `e2e/CP-005-CP-009-pedido.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Flujo Completo de Compra (CP-009 + CP-005) ✅

**Descripción**: Simular el recorrido completo de un usuario desde el login hasta la confirmación del pedido.

**Flujo (CP-009)**:
1.  **Login**: Iniciar sesión con usuario válido.
2.  **Navegación**: Ir a categorías/productos.
3.  **Selección**: Agregar productos al carrito.
4.  **Carrito**: Revisar el carrito.
5.  **Checkout**: Proceder al pago (simulado con PayPal sandbox o botón de prueba).

**Resultado (CP-005)**:
1.  **Confirmación**: Redirección a página de "Pedido Confirmado".
2.  **Persistencia**: El pedido se guarda en el historial del usuario.
3.  **Limpieza**: El carrito queda vacío tras la compra.

---

## Comandos de Ejecución

```bash
npx playwright test e2e/CP-005-CP-009-pedido.spec.js
```
