import { test, expect } from '@playwright/test';

test.describe('CP-017 - Eliminar producto del carrito', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('Verificar que al eliminar un producto desaparece del carrito', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de eliminación de producto del carrito');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });
        console.log('✅ Login exitoso');

        // Ir a productos tradicionales
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');
        console.log('✅ En productos tradicionales');

        // Agregar Oreo al carrito
        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 5000 });
        console.log('✅ Oreo agregado al carrito');

        // Ir al carrito
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');
        console.log('✅ En el carrito');

        // Verificar que Oreo está en el carrito
        await expect(page.locator('text=Oreo').first()).toBeVisible({ timeout: 5000 });
        console.log('✅ Oreo visible en el carrito');

        // Contar productos antes de eliminar
        const productosAntes = await page.locator('.carrito-item').count();
        console.log(`📦 Productos en el carrito antes de eliminar: ${productosAntes}`);

        // Screenshot antes de eliminar
        await page.screenshot({ path: 'e2e/screenshots/CP-017-antes-eliminar.png', fullPage: true });

        // Eliminar el producto
        await page.locator('button:has-text("Eliminar")').first().click();
        await page.waitForTimeout(1000);
        console.log('🗑️ Click en botón Eliminar');

        // Screenshot después de eliminar
        await page.screenshot({ path: 'e2e/screenshots/CP-017-despues-eliminar.png', fullPage: true });

        // Verificar que el producto ya no está
        const oreoVisible = await page.locator('text=Oreo').count();
        expect(oreoVisible).toBe(0);
        console.log('✅ Oreo eliminado del carrito');

        // Contar productos después de eliminar
        const productosDespues = await page.locator('.carrito-item').count();
        console.log(`📦 Productos en el carrito después de eliminar: ${productosDespues}`);

        // Verificar que hay un producto menos
        expect(productosDespues).toBe(productosAntes - 1);
        console.log('✅ Cantidad de productos reducida correctamente');

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que al eliminar todos los productos el carrito queda vacío', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas');
        }

        console.log('🧪 Verificando carrito vacío después de eliminar todos los productos');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });

        // Agregar un producto
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await page.waitForTimeout(1000);
        console.log('✅ Producto agregado');

        // Ir al carrito
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');

        // Eliminar todos los productos
        let botonesEliminar = page.locator('button:has-text("Eliminar")');
        let count = await botonesEliminar.count();

        console.log(`🗑️ Eliminando ${count} producto(s)...`);

        for (let i = 0; i < count; i++) {
            await page.locator('button:has-text("Eliminar")').first().click();
            await page.waitForTimeout(500);
        }

        console.log('✅ Todos los productos eliminados');

        // Verificar que el carrito está vacío
        await expect(page.locator('text=/Tu carrito está vacío|No hay productos/i')).toBeVisible({ timeout: 5000 });
        console.log('✅ Mensaje de carrito vacío visible');

        // Verificar que no hay items en el carrito
        const itemsEnCarrito = await page.locator('.carrito-item').count();
        expect(itemsEnCarrito).toBe(0);
        console.log('✅ No hay items en el carrito');

        // Screenshot del carrito vacío
        await page.screenshot({ path: 'e2e/screenshots/CP-017-carrito-vacio.png', fullPage: true });

        console.log('✅ Prueba completada exitosamente');
    });
});
