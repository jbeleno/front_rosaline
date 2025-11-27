import { test, expect } from '@playwright/test';

test.describe('CP-F25 - Persistencia visual del carrito tras refrescar', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (testEmail && testPassword) {
            await page.goto('/login');
            await page.fill('input[name="correo"]', testEmail);
            await page.fill('input[name="contraseña"]', testPassword);
            await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
            await page.waitForURL('/', { timeout: 15000 });

            // Limpiar carrito
            await page.goto('/carrito');
            await page.waitForLoadState('networkidle');

            const botonesEliminar = page.locator('button:has-text("Eliminar")');
            const count = await botonesEliminar.count();

            for (let i = 0; i < count; i++) {
                await page.locator('button:has-text("Eliminar")').first().click();
                await page.waitForTimeout(500);
            }
            console.log('🧹 Carrito limpiado');
        }
    });

    test('Verificar que los productos y cantidades persisten tras recargar la página', async ({ page }) => {
        console.log('🧪 Iniciando prueba de persistencia del carrito');

        // 1. Agregar productos
        await page.goto('/');
        await page.locator('button:has-text("Tradicional")').click();
        await page.locator('text=Oreo').first().click();

        // Agregar 2 unidades
        const cantidadInput = page.locator('input[type="number"]');
        await cantidadInput.fill('2');
        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible();
        console.log('✅ Agregadas 2 Oreos al carrito');

        // 2. Ir al carrito y verificar estado inicial
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');

        // Capturar datos antes del reload
        const productoVisible = await page.locator('text=Oreo').isVisible();
        const cantidadAntes = await page.locator('.carrito-cantidad').textContent();
        const totalAntes = await page.locator('.carrito-total span').last().textContent();

        console.log(`📊 Estado antes de reload: Visible=${productoVisible}, Cantidad=${cantidadAntes}, Total=${totalAntes}`);

        expect(productoVisible).toBe(true);
        expect(cantidadAntes).toContain('2');

        // Screenshot antes
        await page.screenshot({ path: 'e2e/screenshots/CP-F25-antes-reload.png' });

        // 3. Recargar la página
        console.log('🔄 Recargando página...');
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Esperar a que se cargue el contenido (puede tardar un poco por el fetch al backend)
        await expect(page.locator('text=Oreo')).toBeVisible({ timeout: 10000 });

        // 4. Verificar estado después del reload
        const productoVisibleDespues = await page.locator('text=Oreo').isVisible();
        const cantidadDespues = await page.locator('.carrito-cantidad').textContent();
        const totalDespues = await page.locator('.carrito-total span').last().textContent();

        console.log(`📊 Estado después de reload: Visible=${productoVisibleDespues}, Cantidad=${cantidadDespues}, Total=${totalDespues}`);

        // Validaciones
        expect(productoVisibleDespues).toBe(true);
        expect(cantidadDespues).toBe(cantidadAntes);
        expect(totalDespues).toBe(totalAntes);

        console.log('✅ Persistencia verificada: Los datos son idénticos');

        // Screenshot después
        await page.screenshot({ path: 'e2e/screenshots/CP-F25-despues-reload.png' });
    });
});
