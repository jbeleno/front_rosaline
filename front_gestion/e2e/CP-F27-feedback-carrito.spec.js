import { test, expect } from '@playwright/test';

test.describe('CP-F27 - Feedback visual al agregar al carrito', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login necesario para agregar al carrito
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (testEmail && testPassword) {
            await page.goto('/login');
            await page.fill('input[name="correo"]', testEmail);
            await page.fill('input[name="contraseña"]', testPassword);
            await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
            await page.waitForURL('/', { timeout: 15000 });
        }
    });

    test('Verificar feedback visual (Toast) al agregar desde Detalle de Producto', async ({ page }) => {
        console.log('🧪 Verificando feedback en vista de detalle');

        // 1. Ir a un producto (usando navegación determinista)
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForTimeout(1000);

        const productCard = page.locator('.producto-card').first();
        await productCard.locator('img').click({ force: true });

        // 2. Agregar al carrito
        const addToCartBtn = page.locator('button:has-text("Agregar al carrito")');
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();

        // 3. Verificar Toast
        // Buscamos el contenedor del toast o el texto específico
        const toast = page.locator('.Toastify__toast--success');
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText('¡Producto añadido al carrito!');

        console.log('✅ Toast de éxito visible en detalle');

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-F27-feedback-detalle.png' });
    });

    test('Verificar feedback visual (Toast) al agregar desde Listado de Productos', async ({ page }) => {
        console.log('🧪 Verificando feedback en listado de productos');

        // 1. Ir a listado de productos
        await page.goto('/productos');
        await page.waitForSelector('.producto-card', { timeout: 15000 });

        // 2. Agregar primer producto disponible
        const productCard = page.locator('.producto-card').first();
        const addToCartBtn = productCard.locator('button:has-text("Agregar al carrito")');

        // Asegurar que el botón está visible (puede requerir hover en algunos diseños, pero aquí parece que siempre está)
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();

        // 3. Verificar Toast
        // El mensaje en el listado incluye el nombre del producto: "¡[Nombre] agregado al carrito!"
        const toast = page.locator('.Toastify__toast--success');
        await expect(toast).toBeVisible({ timeout: 5000 });
        await expect(toast).toContainText('agregado al carrito');

        console.log('✅ Toast de éxito visible en listado');

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-F27-feedback-listado.png' });
    });
});
