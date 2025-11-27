import { test, expect } from '@playwright/test';

test.describe('CP-005 - Crear pedido y finalizar compra', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('Verificar que el usuario puede crear un pedido y finalizar compra con PayPal', async ({ page }) => {
        test.setTimeout(90000);

        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;
        const paypalEmail = process.env.E2E_PAYPAL_EMAIL;
        const paypalPassword = process.env.E2E_PAYPAL_PASSWORD;

        if (!testEmail || !testPassword || !paypalEmail || !paypalPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de pedido con PayPal');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });
        console.log('✅ Login exitoso');

        // Agregar producto
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');
        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');
        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 5000 });
        console.log('✅ Producto agregado');

        // Ir al carrito
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');
        console.log('✅ En el carrito');

        // Esperar botón de PayPal
        const paypalButton = page.frameLocator('iframe[title*="PayPal"]').first();
        await expect(paypalButton.locator('body')).toBeVisible({ timeout: 15000 });
        console.log('✅ Botón de PayPal cargado');

        await page.screenshot({ path: 'e2e/screenshots/CP-005-antes-pago.png', fullPage: true });

        // Click en PayPal
        const popupPromise = page.waitForEvent('popup');
        await paypalButton.locator('[data-funding-source="paypal"]').click();
        console.log('🔄 Click en botón de PayPal');

        // Popup de PayPal
        const paypalPage = await popupPromise;
        await paypalPage.waitForLoadState('networkidle');
        console.log('✅ Popup de PayPal abierto');

        // Login en PayPal - Email
        await paypalPage.locator('#email').fill(paypalEmail);
        await paypalPage.locator('#btnNext').click();
        await paypalPage.waitForLoadState('networkidle');
        console.log('✅ Email ingresado');

        // Login en PayPal - Contraseña
        const passwordField = paypalPage.locator('#password');
        await expect(passwordField).toBeVisible({ timeout: 10000 });
        await passwordField.fill(paypalPassword);
        console.log('✅ Contraseña ingresada');

        await paypalPage.locator('#btnLogin, button[name="btnLogin"]').first().click();
        console.log('✅ Click en login de PayPal');

        // Confirmar pago
        const confirmButton = paypalPage.locator('button:has-text("Complete Purchase")').first();
        await expect(confirmButton).toBeVisible({ timeout: 30000 });
        await confirmButton.click();
        console.log('✅ Pago confirmado');

        // Esperar redirección a pedido confirmado
        await page.waitForURL(/.*pedido-confirmado.*/, { timeout: 40000 });
        console.log('✅ Redirigido a pedido confirmado');

        // Verificar que aparece texto de confirmación
        await expect(page.locator('text=/pedido confirmado|pedido/i').first()).toBeVisible({ timeout: 5000 });
        console.log('✅ Texto de confirmación visible');

        await page.screenshot({ path: 'e2e/screenshots/CP-005-pedido-confirmado.png', fullPage: true });
        console.log('✅ Prueba completada - Pedido confirmado exitosamente');
    });
});
