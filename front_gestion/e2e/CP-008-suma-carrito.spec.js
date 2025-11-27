import { test, expect } from '@playwright/test';

test.describe('CP-008 - Suma de productos en el carrito', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login para limpiar el carrito
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (testEmail && testPassword) {
            await page.goto('/login');
            await page.fill('input[name="correo"]', testEmail);
            await page.fill('input[name="contraseña"]', testPassword);
            await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
            await page.waitForURL('/', { timeout: 15000 });

            // Ir al carrito y eliminar todos los productos
            await page.goto('/carrito');
            await page.waitForLoadState('networkidle');

            // Eliminar items mientras existan (bucle robusto)
            while (await page.locator('button:has-text("Eliminar")').count() > 0) {
                await page.locator('button:has-text("Eliminar")').first().click();
                await page.waitForTimeout(500); // Pausa para permitir actualización de UI
            }

            // Verificar que realmente se limpió
            await expect(page.locator('h2:has-text("¡Tu carrito está vacío!")')).toBeVisible({ timeout: 10000 });
            console.log('🧹 Carrito limpiado y verificado');

            // Logout para empezar limpio
            await page.evaluate(() => localStorage.clear());
        }
    });

    test('Verificar que el subtotal se calcula correctamente al agregar el mismo producto dos veces', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de suma de productos en el carrito');

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

        // Agregar primer Oreo
        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        // Obtener precio usando la clase correcta
        const precioElement = page.locator('.vista-producto-precio').first();
        await expect(precioElement).toBeVisible({ timeout: 5000 });
        const precioCompleto = await precioElement.textContent();
        // CORRECCIÓN: Incluir punto decimal en el regex
        const precio = parseFloat(precioCompleto.replace(/[^0-9.]/g, ''));
        console.log(`💰 Precio capturado: "${precioCompleto.trim()}" → ${precio}`);

        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 10000 });

        // Esperar a que el contador del carrito se actualice a (1)
        await expect(page.locator('.header-buttons button:has-text("Carrito")')).toContainText('(1)', { timeout: 10000 });
        console.log('✅ Primera Oreo agregada y confirmada en contador');

        // Volver y agregar otra Oreo
        await page.goto('/productos');
        await page.waitForLoadState('networkidle');
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await expect(page.locator('text=¡Producto añadido al carrito!')).toBeVisible({ timeout: 10000 });

        // Esperar a que el contador del carrito se actualice a (2)
        await expect(page.locator('.header-buttons button:has-text("Carrito")')).toContainText('(2)', { timeout: 10000 });
        console.log('✅ Segunda Oreo agregada y confirmada en contador');

        // Calcular total esperado (2 Oreos)
        const totalEsperado = precio * 2;
        console.log(`🧮 Total esperado: $${totalEsperado} (${precio} x 2)`);

        // Ir al carrito
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');
        console.log('✅ En el carrito');

        // Screenshot del carrito
        await page.screenshot({ path: 'e2e/screenshots/CP-008-carrito-dos-productos.png', fullPage: true });

        // Obtener el total mostrado en el carrito
        const totalElement = page.locator('.carrito-total span').last();
        await expect(totalElement).toBeVisible({ timeout: 5000 });

        const totalMostradoText = await totalElement.textContent();
        // Remover $ y comas, pero mantener el punto decimal
        const totalMostrado = parseFloat(totalMostradoText.replace(/[$,]/g, ''));
        console.log(`💵 Total mostrado en el carrito: "${totalMostradoText.trim()}" → ${totalMostrado}`);

        // Verificar que el total es correcto
        expect(totalMostrado).toBe(totalEsperado);
        console.log('✅ Total calculado correctamente');

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que el total se actualiza al agregar múltiples unidades del mismo producto', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas');
        }

        console.log('🧪 Verificando suma con múltiples unidades');

        // Login
        await page.goto('/login');
        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
        await page.waitForURL('/', { timeout: 15000 });

        // Ir a productos
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        // Agregar Oreo
        await page.locator('text=Oreo').first().click();
        await page.waitForLoadState('networkidle');

        // Obtener precio usando la clase correcta
        const precioElement = page.locator('.vista-producto-precio').first();
        await expect(precioElement).toBeVisible({ timeout: 5000 });
        const precioCompleto = await precioElement.textContent();
        // CORRECCIÓN: Incluir punto decimal en el regex
        const precio = parseFloat(precioCompleto.replace(/[^0-9.]/g, ''));
        console.log(`💰 Precio capturado: "${precioCompleto.trim()}" → ${precio}`);

        // Buscar el input de cantidad y cambiar a 3
        const cantidadSelector = 'input[type="number"], input[min="1"]';
        const cantidadInput = page.locator(cantidadSelector).first();
        await cantidadInput.click();
        await cantidadInput.clear();
        await cantidadInput.fill('3');
        console.log('✅ Cantidad cambiada a 3');

        await page.locator('button:has-text("Agregar al carrito")').click();
        await page.waitForTimeout(2000);
        console.log('✅ Producto agregado con cantidad 3');

        // Ir al carrito
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');

        // Verificar que solo hay 1 item en el carrito
        const itemsEnCarrito = await page.locator('.carrito-item').count();
        expect(itemsEnCarrito).toBe(1);
        console.log('✅ Solo 1 item en el carrito');

        // Verificar que la cantidad es 3
        const cantidadTexto = await page.locator('.carrito-cantidad').first().textContent();
        expect(cantidadTexto).toContain('3');
        console.log('✅ Cantidad 3 visible en el carrito');

        // Verificar total (precio * 3)
        const totalEsperado = precio * 3;
        console.log(`🧮 Total esperado: $${totalEsperado} (${precio} x 3)`);

        const totalElement = page.locator('.carrito-total span').last();
        const totalText = await totalElement.textContent();
        // Remover $ y comas, pero mantener el punto decimal
        const totalMostrado = parseFloat(totalText.replace(/[$,]/g, ''));
        console.log(`💵 Total mostrado en el carrito: "${totalText.trim()}" → ${totalMostrado}`);

        expect(totalMostrado).toBe(totalEsperado);
        console.log(`✅ Total correcto: $${totalMostrado} (${precio} x 3)`);
    });
});