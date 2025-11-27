# CP-020 y CP-021 - Búsqueda de Productos - Prueba E2E

## Información General

- **Códigos de Caso de Prueba**: 
  - **CP-020**: Búsqueda de productos exitosa
  - **CP-021**: Búsqueda sin coincidencias
- **Nombre**: Búsqueda de Productos y Manejo de Vacíos - Prueba E2E
- **Tipo de Prueba**: End-to-End Test
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción

Valida la funcionalidad del buscador del header:
1.  **Búsqueda Exitosa (CP-020)**: Encontrar productos que coinciden con el criterio.
2.  **Sin Coincidencias (CP-021)**: Manejar correctamente cuando no hay resultados, mostrando un mensaje apropiado o lista vacía.

---

## Ubicación del Archivo

**Archivo de prueba**: `e2e/CP-020-CP-021-busqueda.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Búsqueda Exitosa (CP-020) ✅

**Descripción**: Buscar un producto existente (ej. "Oreo") y verificar resultados.

**Pasos**:
1. Escribir "Oreo" en el buscador.
2. Presionar Enter o click en buscar.
3. Verificar que aparecen tarjetas de producto.
4. Verificar que los nombres contienen "Oreo".

**Resultado esperado**: Lista de productos filtrada.

---

### Test 2: Búsqueda Sin Resultados (CP-021) 🔍

**Descripción**: Buscar un término inexistente y verificar feedback.

**Pasos**:
1. Escribir "ProductoInexistenteXYZ".
2. Ejecutar búsqueda.
3. **Validación CP-021**: Verificar que aparece mensaje de "No se encontraron productos" o lista vacía.

**Resultado esperado**: Mensaje informativo de sin resultados.

---

## Comandos de Ejecución

```bash
npx playwright test e2e/CP-020-CP-021-busqueda.spec.js
```
