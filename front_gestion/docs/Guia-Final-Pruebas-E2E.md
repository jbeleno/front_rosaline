# Guía Maestra de Pruebas E2E con Playwright - Proyecto Rosaline

## Introducción

Este documento sirve como guía definitiva para la ejecución, mantenimiento y comprensión de la suite de pruebas End-to-End (E2E) implementada para el frontend de gestión de Rosaline.

Las pruebas E2E simulan el comportamiento de un usuario real interactuando con la aplicación en un navegador, validando que todos los componentes (Frontend, Backend, Base de Datos) funcionen correctamente en conjunto.

---

## 🛠️ Tecnologías Usadas

- **Framework**: [Playwright](https://playwright.dev/)
- **Lenguaje**: JavaScript / Node.js
- **Navegador**: Chromium (por defecto), Firefox, WebKit
- **Entorno**: Local (`localhost:3000`) contra Backend de Desarrollo

---

## 🚀 Cómo Ejecutar las Pruebas

### 1. Prerrequisitos
- El frontend debe estar corriendo: `npm start` (Puerto 3000)
- El backend debe estar corriendo (Puerto 8080)
- Archivo `.env.test` configurado con credenciales válidas.

### 2. Comandos Principales

| Acción | Comando | Descripción |
|--------|---------|-------------|
| **Ejecutar Todo** | `npx playwright test` | Corre todas las pruebas en modo headless (sin interfaz). |
| **Modo Visual** | `npx playwright test --headed` | Abre el navegador y ves las acciones en tiempo real. |
| **Modo UI** | `npx playwright test --ui` | Abre una interfaz gráfica avanzada para explorar, ejecutar y depurar tests. |
| **Un solo archivo** | `npx playwright test e2e/nombre-archivo.spec.js` | Ejecuta solo un archivo específico. |
| **Debug** | `npx playwright test --debug` | Ejecuta paso a paso para inspeccionar errores. |
| **Reporte** | `npx playwright show-report` | Abre el reporte HTML de la última ejecución. |

---

## 📋 Catálogo de Pruebas Implementadas

A continuación, se listan todos los casos de prueba cubiertos, mapeados a sus archivos correspondientes.

### 🔐 Autenticación y Usuarios

| Caso | Descripción | Archivo | Estado |
|------|-------------|---------|--------|
| **CP-002** | Inicio de Sesión Exitoso | `e2e/CP-002-CP-F22-login.spec.js` | ✅ |
| **CP-F22** | Validación Visual Login (Errores) | `e2e/CP-002-CP-F22-login.spec.js` | ✅ |
| **CP-F23** | Validación Registro (Errores) | `e2e/CP-F23-registro-validacion.spec.js` | ✅ |
| **CP-006** | Gestión de Perfil (Ver/Editar) | `e2e/CP-006-perfil.spec.js` | ✅ |

### 🛒 Carrito de Compras

| Caso | Descripción | Archivo | Estado |
|------|-------------|---------|--------|
| **CP-004** | Agregar/Ver Carrito | `e2e/CP-004-carrito.spec.js` | ✅ |
| **CP-008** | Cálculo de Totales (Suma) | `e2e/CP-008-suma-carrito.spec.js` | ✅ |
| **CP-017** | Eliminar Items del Carrito | `e2e/CP-017-eliminar-carrito.spec.js` | ✅ |
| **CP-F24** | Contador en Header | `e2e/CP-F24-contador-carrito.spec.js` | ✅ |
| **CP-F25** | Persistencia tras Reload | `e2e/CP-F25-persistencia-carrito.spec.js` | ✅ |
| **CP-F27** | Feedback Visual (Toasts) | `e2e/CP-F27-feedback-carrito.spec.js` | ✅ |

### 📦 Productos y Navegación

| Caso | Descripción | Archivo | Estado |
|------|-------------|---------|--------|
| **CP-020** | Búsqueda Exitosa | `e2e/CP-020-CP-021-busqueda.spec.js` | ✅ |
| **CP-021** | Búsqueda Sin Resultados | `e2e/CP-020-CP-021-busqueda.spec.js` | ✅ |
| **CP-F003** | Filtros por Categoría | `e2e/CP-F003-filter.spec.js` | ✅ |
| **CP-F26** | Navegación a Detalle | `e2e/CP-F26-navegacion-detalle.spec.js` | ✅ |

### 💳 Pedidos y Flujo Completo

| Caso | Descripción | Archivo | Estado |
|------|-------------|---------|--------|
| **CP-005** | Generación de Pedido | `e2e/CP-005-CP-009-pedido.spec.js` | ✅ |
| **CP-009** | Flujo Completo (Integración) | `e2e/CP-005-CP-009-pedido.spec.js` | ✅ |

---

## 💡 Buenas Prácticas para E2E

1.  **Selectores Robustos**: Usa `data-testid` o selectores de texto/rol (`getByRole`, `getByText`) en lugar de clases CSS frágiles.
2.  **Independencia**: Cada test debe poder correr solo. Usa `beforeEach` para preparar el estado (login, limpiar carrito).
3.  **Esperas Inteligentes**: Evita `waitForTimeout(5000)`. Usa `expect(locator).toBeVisible()` que espera automáticamente.
4.  **Limpieza**: Asegúrate de que tus tests no dejen "basura" en la base de datos si es posible, o usa un entorno de pruebas dedicado.

---

## 📂 Estructura de Carpetas

```
e2e/
├── screenshots/          # Capturas de pantalla de las pruebas
├── CP-xxx.spec.js        # Archivos de prueba individuales
└── ...
docs/
├── CP-xxx-E2E.md         # Documentación detallada de cada caso
└── Guia-Final-Pruebas-E2E.md # Este archivo
```

---
 
**Fecha**: 26 de Noviembre, 2025
