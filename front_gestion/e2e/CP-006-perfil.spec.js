import { test, expect } from '@playwright/test';

test.describe('CP-006 - Editar información de perfil', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('Verificar que el usuario puede editar su perfil completo', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de edición de perfil');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });
        console.log('✅ Login exitoso');

        // Ir a Mi Cuenta
        await page.locator('button:has-text("Mi cuenta"), a:has-text("Mi cuenta")').click();
        await page.waitForLoadState('networkidle');
        console.log('✅ En página de Mi Cuenta');

        // Esperar a que cargue la información del perfil
        await expect(page.locator('h3:has-text("Información Personal")')).toBeVisible({ timeout: 5000 });

        // Guardar datos originales para restaurar después
        const nombreOriginal = await page.locator('p:has-text("Nombre:") b').textContent();
        const apellidoOriginal = await page.locator('p:has-text("Apellido:") b').textContent();

        // Click en "Editar información"
        await page.locator('button:has-text("Editar información")').click();
        await page.waitForTimeout(500);
        console.log('✅ Modo edición activado');

        // Generar datos únicos para la prueba
        const timestamp = Date.now();
        const nuevoNombre = `TestNombre${timestamp}`;
        const nuevoApellido = `TestApellido${timestamp}`;
        const nuevoTelefono = `300${timestamp.toString().slice(-7)}`;
        const nuevaDireccion = `Calle Test ${timestamp}`;

        // Editar campos
        await page.locator('input[placeholder="Tu nombre"]').fill(nuevoNombre);
        await page.locator('input[placeholder="Tu apellido"]').fill(nuevoApellido);
        await page.locator('input[placeholder="Tu teléfono"]').fill(nuevoTelefono);
        await page.locator('input[placeholder="Tu dirección"]').fill(nuevaDireccion);
        console.log('✅ Campos editados');

        // Screenshot antes de guardar
        await page.screenshot({ path: 'e2e/screenshots/CP-006-antes-guardar.png', fullPage: true });

        // Guardar cambios
        await page.locator('button:has-text("Guardar cambios")').click();
        console.log('🔄 Guardando cambios...');

        // Verificar toast de éxito
        await expect(page.locator('text=Perfil actualizado exitosamente')).toBeVisible({ timeout: 5000 });
        console.log('✅ Toast de éxito visible');

        // Esperar a que se oculte el formulario de edición
        await page.waitForTimeout(1000);

        // Verificar que los datos se actualizaron en la vista
        await expect(page.locator(`text=${nuevoNombre}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevoApellido}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevoTelefono}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevaDireccion}`)).toBeVisible({ timeout: 5000 });
        console.log('✅ Datos actualizados visibles');

        // Screenshot después de guardar
        await page.screenshot({ path: 'e2e/screenshots/CP-006-despues-guardar.png', fullPage: true });

        // Recargar página para verificar persistencia
        await page.reload();
        await page.waitForLoadState('networkidle');
        console.log('🔄 Página recargada');

        // Verificar que los datos persisten después de recargar
        await expect(page.locator(`text=${nuevoNombre}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevoApellido}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevoTelefono}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${nuevaDireccion}`)).toBeVisible({ timeout: 5000 });
        console.log('✅ Datos persisten después de recargar');

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que se puede cancelar la edición', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas');
        }

        console.log('🧪 Iniciando prueba de cancelación de edición');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });

        // Ir a Mi Cuenta
        await page.locator('button:has-text("Mi cuenta"), a:has-text("Mi cuenta")').click();
        await page.waitForLoadState('networkidle');

        // Guardar nombre original
        const nombreOriginalElement = page.locator('p').filter({ hasText: /Nombre:/ });
        const nombreOriginalText = await nombreOriginalElement.textContent();
        const nombreOriginal = nombreOriginalText.replace('Nombre:', '').trim();

        // Click en "Editar información"
        await page.locator('button:has-text("Editar información")').click();
        await page.waitForTimeout(500);

        // Modificar el nombre
        await page.locator('input[placeholder="Tu nombre"]').fill('NombreQueNoSeGuardara');

        // Click en "Cancelar"
        await page.locator('button:has-text("Cancelar")').click();
        console.log('✅ Click en Cancelar');

        // Verificar que el nombre original sigue ahí
        await expect(page.locator(`text=${nombreOriginal}`)).toBeVisible({ timeout: 5000 });
        console.log('✅ Cambios cancelados correctamente');
    });
});
