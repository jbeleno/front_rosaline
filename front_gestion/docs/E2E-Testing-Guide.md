# 🎭 Guía de Pruebas E2E con Playwright

## 📋 Configuración Inicial

### 1️⃣ Configurar Credenciales de Prueba

Edita el archivo `.env.test` en la raíz del proyecto y reemplaza los valores con tus credenciales reales:

```env
# URL base de la aplicación
E2E_BASE_URL=http://localhost:3000

# Credenciales del usuario de prueba
E2E_TEST_USER_EMAIL=tu.email@rosaline.com
E2E_TEST_USER_PASSWORD=TuPasswordReal123!

# Datos del perfil
E2E_TEST_USER_NAME=TuNombre
E2E_TEST_USER_LASTNAME=TuApellido
```

⚠️ **IMPORTANTE**: 
- El usuario debe existir en tu base de datos
- La cuenta debe estar confirmada
- El perfil debe estar completo

---

## 🚀 Ejecutar las Pruebas

### Opción 1: Modo Headless (sin interfaz gráfica)
```bash
npm run test:e2e
```

### Opción 2: Modo Headed (con navegador visible)
```bash
npm run test:e2e:headed
```

### Opción 3: Modo UI (interfaz interactiva de Playwright)
```bash
npm run test:e2e:ui
```

### Opción 4: Ver reporte de la última ejecución
```bash
npm run test:e2e:report
```

---

## 📁 Estructura de Archivos

```
front_gestion/
├── .env.test                    # ⚠️ Credenciales (NO subir a Git)
├── playwright.config.js         # Configuración de Playwright
├── e2e/                         # Carpeta de pruebas E2E
│   ├── CP-002-login.spec.js    # Prueba de login
│   └── screenshots/             # Capturas de pantalla
├── playwright-report/           # Reportes HTML (generado)
└── test-results/                # Resultados de ejecución (generado)
```

---

## 🧪 Pruebas Implementadas

### CP-002-E2E - Inicio de Sesión

**Archivo**: `e2e/CP-002-login.spec.js`

**Casos de prueba**:

1. ✅ **Login exitoso con credenciales válidas**
   - Navega a `/login`
   - Ingresa credenciales
   - Verifica redirección a `/`
   - Valida token JWT en localStorage
   - Verifica UI de usuario autenticado

2. ❌ **Login fallido con credenciales incorrectas**
   - Intenta login con credenciales inválidas
   - Verifica mensaje de error
   - Confirma que no hay token

3. 🚫 **Validación de campos vacíos**
   - Intenta enviar formulario sin datos
   - Verifica que el navegador previene el submit

---

## 📊 Interpretar Resultados

### Ejecución Exitosa
```
Running 3 tests using 1 worker

  ✓  CP-002-E2E - Inicio de Sesión › Verificar que un usuario confirmado... (5.2s)
  ✓  CP-002-E2E - Inicio de Sesión › Verificar que credenciales incorrectas... (2.1s)
  ✓  CP-002-E2E - Inicio de Sesión › Verificar que campos vacíos... (1.8s)

  3 passed (9.1s)
```

### Ejecución con Fallos
```
  ✓  Test 1 passed
  ✗  Test 2 failed

  1) CP-002-E2E - Inicio de Sesión › Verificar que un usuario confirmado...
     Error: Timeout 10000ms exceeded.
     waiting for locator('a:has-text("Mi Cuenta")')
```

**Qué hacer si falla**:
1. Revisa el reporte HTML: `npm run test:e2e:report`
2. Verifica las capturas de pantalla en `test-results/`
3. Revisa los videos en `test-results/` (si están habilitados)
4. Verifica que el servidor esté corriendo en `http://localhost:3000`

---

## 🛠️ Configuración Avanzada

### Ejecutar solo un test específico
```bash
npx playwright test e2e/CP-002-login.spec.js
```

### Ejecutar con debug
```bash
npx playwright test --debug
```

### Ejecutar en múltiples navegadores
Edita `playwright.config.js` y descomenta los proyectos de Firefox y WebKit.

---

## 🔧 Solución de Problemas

### Error: "Credenciales de prueba no configuradas"
**Solución**: Edita `.env.test` y configura `E2E_TEST_USER_EMAIL` y `E2E_TEST_USER_PASSWORD`

### Error: "Timeout waiting for locator"
**Solución**: 
- Verifica que el servidor esté corriendo
- Aumenta el timeout en `playwright.config.js`
- Verifica que los selectores sean correctos

### Error: "Login failed"
**Solución**:
- Verifica que el usuario exista en la BD
- Confirma que la cuenta esté confirmada
- Verifica que la contraseña sea correcta

---

## 📝 Agregar Nuevas Pruebas E2E

1. Crea un nuevo archivo en `e2e/`:
   ```bash
   e2e/CP-XXX-nombre-prueba.spec.js
   ```

2. Usa la estructura base:
   ```javascript
   import { test, expect } from '@playwright/test';

   test.describe('CP-XXX - Nombre de la Prueba', () => {
     test('Descripción del test', async ({ page }) => {
       // Tu código aquí
     });
   });
   ```

3. Ejecuta la nueva prueba:
   ```bash
   npm run test:e2e
   ```

---

## 🎯 Mejores Prácticas

✅ **Hacer**:
- Usar selectores semánticos (`role`, `text`)
- Esperar a que los elementos estén visibles antes de interactuar
- Limpiar el estado entre tests (`beforeEach`)
- Capturar screenshots en fallos

❌ **Evitar**:
- Hardcodear credenciales en el código
- Usar selectores frágiles (clases CSS dinámicas)
- Tests que dependan del orden de ejecución
- Timeouts muy largos

---

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

**Última actualización**: 2025-11-26
