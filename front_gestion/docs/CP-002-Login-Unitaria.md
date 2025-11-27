# CP-002 - Inicio de Sesión - Prueba Unitaria

## Información General

- **Código de Caso de Prueba**: CP-002
- **Nombre**: Inicio de sesión - Prueba Unitaria
- **Tipo de Prueba**: Component Integration Test
- **Fecha de Implementación**: 2025-11-26
- **Responsable**: Equipo Frontend
- **Estado**: ✅ APROBADO

---

## Descripción

Prueba unitaria/integración del componente `LoginRegister` que valida:
- Renderizado del formulario de login
- Entrada de credenciales
- Llamada a la función de autenticación
- Redirección tras login exitoso

---

## Ubicación del Archivo

**Archivo de prueba**: `src/components/LoginRegister.test.js`

**Componente probado**: `src/components/LoginRegister.js`

---

## Tipo de Prueba

**Component Integration Test**

### ¿Por qué este tipo?

Esta es una prueba de integración a nivel de componente porque:

1. **Alcance**: Prueba el componente `LoginRegister` y su interacción con el hook `useAuth` y el sistema de enrutamiento
2. **Aislamiento**: Utiliza mocks para simular dependencias externas (backend, autenticación, navegación)
3. **Velocidad**: Se ejecuta rápidamente sin necesidad de un servidor backend real
4. **Mantenibilidad**: No depende de datos reales que puedan cambiar

---

## Tecnologías Utilizadas

- **Framework de Testing**: Jest (incluido en create-react-app)
- **Testing Library**: React Testing Library (@testing-library/react)
- **Mocking**: Jest mocks para `useAuth` y `react-router-dom`

---

## Implementación

### Estructura de la Prueba

```javascript
describe('CP-002 - Inicio de sesión', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Verificar que un usuario confirmado puede iniciar sesión y recibe un token JWT', async () => {
    // 1. Configuración de mocks
    // 2. Renderizado del componente
    // 3. Interacción con el formulario
    // 4. Verificación de llamadas a funciones
    // 5. Verificación de redirección
  });
});
```

### Pasos de la Prueba

1. **Configuración Inicial**
   - Se crea un mock de la función `login` que simula un login exitoso
   - Se configura el hook `useAuth` para retornar el estado inicial (no autenticado)

2. **Renderizado del Componente**
   - Se renderiza el componente `LoginRegister` dentro de un `BrowserRouter`

3. **Verificación de UI Inicial**
   - Se verifica que el formulario de login se muestra correctamente

4. **Simulación de Entrada de Datos**
   - Se ingresa un correo electrónico: `usuario@test.com`
   - Se ingresa una contraseña: `password123`

5. **Envío del Formulario**
   - Se hace clic en el botón "Iniciar sesión"

6. **Verificación de Autenticación**
   - Se verifica que la función `login` fue llamada exactamente 1 vez
   - Se verifica que fue llamada con los parámetros correctos: `('usuario@test.com', 'password123')`

7. **Simulación de Estado Autenticado**
   - Se actualiza el mock de `useAuth` para simular que el usuario está autenticado
   - Se re-renderiza el componente

8. **Verificación de Redirección**
   - Se verifica que la función `navigate` fue llamada con `('/', { replace: true })`
   - Esto confirma que el usuario es redirigido a la página principal tras login exitoso

---

## Mocks Utilizados

### Mock de `useAuth`

```javascript
jest.mock('../features/auth/hooks/useAuth');

useAuth.mockReturnValue({
  isAuthenticated: false,
  login: mockLogin,
  loading: false,
});
```

### Mock de `react-router-dom`

```javascript
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}), { virtual: true });
```

**Nota**: Se usa `{ virtual: true }` para evitar problemas de resolución de módulos con react-router-dom v7.

---

## Comando de Ejecución

```bash
# Ejecutar solo esta prueba
npm test -- LoginRegister.test.js

# Ejecutar con cobertura
npm test -- --coverage LoginRegister.test.js

# Ejecutar en modo watch
npm test -- --watch LoginRegister.test.js
```

---

## Resultado de Ejecución

```
PASS  src/components/LoginRegister.test.js
  CP-002 - Inicio de sesión
    ✓ Verificar que un usuario confirmado puede iniciar sesión y recibe un token JWT (198 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.853 s
```

---

## Validaciones Realizadas

| # | Validación | Estado | Descripción |
|---|------------|--------|-------------|
| 1 | Renderizado del formulario | ✅ | El formulario de login se muestra correctamente |
| 2 | Entrada de credenciales | ✅ | Los campos de correo y contraseña aceptan input |
| 3 | Llamada a función de login | ✅ | Se invoca `login()` con los parámetros correctos |
| 4 | Redirección post-login | ✅ | El usuario es redirigido a `/` tras autenticación exitosa |

---

## Lo que SÍ Cubre

- ✅ Interacción del usuario con el formulario
- ✅ Validación de que el componente llama correctamente a las funciones de autenticación
- ✅ Flujo de redirección tras login exitoso
- ✅ Lógica del componente

---

## Lo que NO Cubre

- ❌ Validación real de credenciales contra el backend
- ❌ Almacenamiento real del token JWT en localStorage
- ❌ Decodificación del token JWT
- ❌ Manejo de errores de red o servidor
- ❌ Casos de credenciales inválidas (se puede agregar en futuras iteraciones)

---

## Recomendaciones

### Para Cobertura Completa

Esta prueba unitaria debe complementarse con:

1. **Prueba E2E** (ver `CP-002-Login-E2E.md`):
   - Validación real de credenciales
   - Generación y validación de tokens JWT
   - Integración con backend real

2. **Pruebas Unitarias Adicionales**:
   - Validación de formulario vacío
   - Manejo de errores de login (credenciales incorrectas)
   - Manejo de cuenta no confirmada

---

## Notas Técnicas

### Problema con react-router-dom v7

Se utiliza un mock virtual de `react-router-dom` debido a problemas de compatibilidad con la versión 7 en el entorno de pruebas de Jest:

```javascript
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}), { virtual: true });
```

---

## Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-11-26 | 1.0 | Implementación inicial de la prueba |
| 2025-11-26 | 1.1 | Agregada verificación de redirección post-login |
| 2025-11-26 | 1.2 | Movida a `src/components/` siguiendo convención de CRA |

---

## Conclusión

La prueba unitaria CP-002 valida exitosamente el flujo de inicio de sesión a nivel de componente, asegurando que:
- El formulario funciona correctamente
- Las credenciales se envían al servicio de autenticación
- El usuario es redirigido tras un login exitoso

Esta prueba forma parte de la suite de pruebas unitarias y debe ejecutarse en cada cambio relacionado con el componente de autenticación.

---

**Última actualización**: 2025-11-26  
**Autor**: Equipo Frontend  
**Tipo de prueba**: Unitaria/Integración de Componente
