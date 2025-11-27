# CP-002 y CP-F22 - Inicio de Sesión y Validación - Prueba E2E

## Información General

- **Códigos de Caso de Prueba**: 
  - **CP-002**: Inicio de sesión exitoso
  - **CP-F22**: Validación visual en formulario de login
- **Nombre**: Inicio de sesión y Validación Visual - Prueba E2E
- **Tipo de Prueba**: End-to-End Test
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción

Esta suite de pruebas E2E valida dos aspectos críticos del inicio de sesión:
1.  **Funcionalidad (CP-002)**: El flujo completo de autenticación, desde el ingreso de credenciales hasta la redirección y almacenamiento del token.
2.  **Validación Visual (CP-F22)**: La respuesta de la interfaz ante errores del usuario, como campos vacíos o credenciales incorrectas, asegurando que se muestren los mensajes de error apropiados.

---

## Ubicación del Archivo

**Archivo de prueba**: `e2e/CP-002-CP-F22-login.spec.js`

**Framework**: Playwright

---

## Casos de Prueba Implementados

### Test 1: Login Exitoso (CP-002) ✅

**Descripción**: Verificar que un usuario confirmado puede iniciar sesión y recibe un token JWT.

**Pasos**:
1. Navegar a `/login`.
2. Ingresar credenciales válidas.
3. Click en "Iniciar sesión".
4. Verificar redirección a `/`.
5. Verificar almacenamiento de token JWT en `localStorage`.

**Resultado esperado**: Acceso concedido y redirección.

---

### Test 2: Credenciales Incorrectas (CP-002 / CP-F22) ❌

**Descripción**: Verificar que credenciales incorrectas muestran error visual.

**Pasos**:
1. Ingresar email/password inválidos.
2. Click en "Iniciar sesión".
3. **Validación CP-F22**: Verificar que aparece el mensaje de error visual (Toast o alerta).
4. Verificar que NO hay redirección ni token.

**Resultado esperado**: Mensaje de error visible y permanencia en login.

---

### Test 3: Campos Vacíos (CP-F22) 🚫

**Descripción**: Verificar validación de campos requeridos.

**Pasos**:
1. Intentar enviar el formulario vacío.
2. **Validación CP-F22**: Verificar que el navegador o la UI impiden el envío y muestran advertencia.

**Resultado esperado**: El formulario no se envía.

---

## Comandos de Ejecución

```bash
npx playwright test e2e/CP-002-CP-F22-login.spec.js
```
