import { test, expect } from '@playwright/test';

test.describe('CP-F24 - Icono y contador de carrito en encabezado', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login para tener acceso al carrito
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (testEmail && testPassword) {
            await page.goto('/login');
            await page.fill('input[name="correo"]', testEmail);
            await page.fill('input[name="contraseña"]', testPassword);
            await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
            await page.waitForURL('/', { timeout: 15000 });

            // Limpiar carrito para empezar desde cero
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

    test('Verificar que el contador suma las cantidades totales de productos', async ({ page }) => {
        console.log('🧪 Iniciando prueba de contador de carrito (suma de cantidades)');

        // 1. Verificar estado inicial (sin contador)
        await page.goto('/');
        // Selector específico para el botón del header
        const botonCarrito = page.locator('.header-buttons button:has-text("Carrito")');
        await expect(botonCarrito).toBeVisible();
        await expect(botonCarrito).not.toContainText('(');
        console.log('✅ Estado inicial verificado: Carrito vacío');

        // 2. Agregar primer producto (Cantidad: 1)
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();

        // Esperar a que aparezca el toast de éxito
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 10000 });

        // Esperar explícitamente a que el contador cambie
        console.log('⏳ Esperando actualización del contador a (1)...');
        await expect(botonCarrito).toContainText('(1)', { timeout: 10000 });

        const textoBoton1 = await botonCarrito.textContent();
        console.log(`✅ Contador actualizado: "${textoBoton1.trim()}"`);

        // 3. Agregar el MISMO producto otra vez (Cantidad total: 2)
        await page.goto('/productos');
        await page.locator('button:has-text("Tradicional")').click();
        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 10000 });

        console.log('⏳ Esperando actualización del contador a (2)...');
        await expect(botonCarrito).toContainText('(2)', { timeout: 10000 });

        const textoBoton2 = await botonCarrito.textContent();
        console.log(`✅ Contador actualizado: "${textoBoton2.trim()}"`);

        // 4. Agregar OTRO producto (Cantidad total: 3)
        await page.goto('/productos');
        await page.locator('button:has-text("Tradicional")').click();

        const otroProducto = page.locator('.producto-card').nth(1);
        await otroProducto.click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 10000 });

        console.log('⏳ Esperando actualización del contador a (3)...');
        await expect(botonCarrito).toContainText('(3)', { timeout: 10000 });

        const textoBoton3 = await botonCarrito.textContent();
        console.log(`✅ Contador actualizado: "${textoBoton3.trim()}"`);

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-F24-contador-total.png' });

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que el contador persiste al navegar entre páginas', async ({ page }) => {
        console.log('🧪 Verificando persistencia del contador');

        // Agregar un producto
        await page.locator('button:has-text("Tradicional")').click();
        await page.locator('text=Oreo').first().click();
        await page.locator('button:has-text("Agregar al carrito")').click();
        await page.waitForTimeout(1000);

        const botonCarrito = page.locator('.header-buttons button:has-text("Carrito")');
        await expect(botonCarrito).toContainText('(1)');

        // Navegar a Home
        await page.goto('/');
        await expect(botonCarrito).toContainText('(1)');
        console.log('✅ Contador persiste en Home');

        // Navegar a Mi Cuenta
        await page.locator('button:has-text("Mi cuenta")').click();
        await expect(botonCarrito).toContainText('(1)');
        console.log('✅ Contador persiste en Mi Cuenta');
    });
});
