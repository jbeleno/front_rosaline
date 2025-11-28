import { test, expect } from '@playwright/test';

test.describe('CP-002-E2E - Inicio de Sesión', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('Verificar que un usuario confirmado puede iniciar sesión y recibe un token JWT', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de login con:', testEmail);

        // Navegar a login
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Verificar formulario
        await expect(page.locator('h2')).toContainText('Iniciar sesión');

        // Llenar formulario
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        console.log('✅ Formulario llenado');

        // Click en login
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        console.log('🔄 Click en botón de login');

        // Esperar redirección
        console.log('⏳ Esperando redirección...');
        await page.waitForURL('/', { timeout: 15000 });
        console.log('✅ Redirección exitosa');

        // Verificar token JWT
        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeTruthy();
        expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        console.log('✅ Token JWT encontrado');

        // Verificar que el usuario está autenticado mediante la UI
        // El botón "Mi cuenta" o "Salir" debe estar visible
        await expect(page.locator('button:has-text("Mi cuenta")')).toBeVisible();
        await expect(page.locator('button:has-text("Salir")')).toBeVisible();
        console.log('✅ Usuario autenticado verificado en UI');

        // Screenshot de éxito
        await page.screenshot({
            path: 'e2e/screenshots/CP-002-login-success.png',
            fullPage: true
        });

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que credenciales incorrectas muestran error', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        await page.fill('input[name="correo"]', 'usuario.invalido@test.com');
        await page.fill('input[name="contraseña"]', 'PasswordIncorrecta123!');
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();

        // Usar un selector específico para el error del formulario (evita conflicto con Toasts)
        const errorMessage = page.locator('.login-error');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeNull();

        await expect(page).toHaveURL(/.*login/);
    });

    test('Verificar que campos vacíos no permiten enviar el formulario', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        const loginButton = page.locator('form button[type="submit"]:has-text("Iniciar sesión")');
        await loginButton.click();

        await expect(page).toHaveURL(/.*login/);

        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeNull();
    });
});
