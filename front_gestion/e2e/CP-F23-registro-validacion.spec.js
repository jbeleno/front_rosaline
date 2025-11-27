import { test, expect } from '@playwright/test';

test.describe('CP-F23 - Mensajes de error en registro inválido', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Cambiar a modo registro usando el texto correcto
        await page.locator('text=Regístrate').click();
        await page.waitForTimeout(300);
        console.log('✅ En modo registro');
    });

    test('Verificar que correo con formato inválido muestra alerta Toast', async ({ page }) => {
        console.log('🧪 Verificando validación de formato de correo');

        // Intentar ingresar correo sin @
        await page.fill('input[name="correo"]', 'correoinvalido');
        await page.fill('input[name="contraseña"]', 'Password123!');

        // Intentar enviar
        await page.locator('form button[type="submit"]').click();

        // Verificar mensaje Toast
        const toast = page.locator('.Toastify__toast--error');
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText('Por favor ingresa un correo válido');
        console.log('✅ Alerta de correo inválido mostrada correctamente');

        // Verificar que NO redirige
        await expect(page).toHaveURL(/.*login/);
    });

    test('Verificar que campos vacíos muestran alerta Toast', async ({ page }) => {
        console.log('🧪 Verificando validación de campos vacíos');

        // Intentar enviar sin llenar nada
        await page.locator('form button[type="submit"]').click();

        // Verificar mensaje Toast para correo obligatorio
        const toast = page.locator('.Toastify__toast--error');
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText('El correo es obligatorio');
        console.log('✅ Alerta de campos vacíos mostrada correctamente');

        // Verificar que NO redirige
        await expect(page).toHaveURL(/.*login/);
    });

    test('Verificar que contraseña corta muestra alerta Toast', async ({ page }) => {
        console.log('🧪 Verificando validación de contraseña corta');

        await page.fill('input[name="correo"]', 'test@test.com');
        await page.fill('input[name="contraseña"]', '123'); // Corta

        // Enviar formulario
        await page.locator('form button[type="submit"]').click();

        // Verificar mensaje Toast
        const toast = page.locator('.Toastify__toast--error');
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText('La contraseña debe tener al menos 8 caracteres');
        console.log('✅ Alerta de contraseña corta mostrada correctamente');
    });

    test('Verificar que correo ya registrado muestra alerta Toast del backend', async ({ page }) => {
        console.log('🧪 Verificando mensaje de error para correo duplicado');

        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        if (!testEmail) {
            console.log('⚠️ No hay correo de prueba configurado');
            return;
        }

        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', 'NuevaPassword123!');

        // Enviar formulario
        await page.locator('form button[type="submit"]').click();

        // Esperar mensaje de error (puede tardar por el backend)
        const toast = page.locator('.Toastify__toast--error');
        await expect(toast).toBeVisible({ timeout: 8000 });

        const errorText = await toast.textContent();
        console.log(`✅ Mensaje de error del backend: "${errorText}"`);

        // Verificar contenido del mensaje
        expect(errorText.toLowerCase()).toMatch(/ya existe|duplicado|registrado|error/);

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-F23-toast-error.png', fullPage: true });
    });
});
