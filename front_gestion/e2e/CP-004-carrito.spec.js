import { test, expect } from '@playwright/test';

/**
 * CP-004 - Prueba E2E de Añadir Producto al Carrito
 * 
 * Esta prueba valida que un usuario autenticado con perfil completo
 * puede agregar productos al carrito correctamente.
 */

test.describe('CP-004 - Añadir producto al carrito', () => {

    test.beforeEach(async ({ page }) => {
        // Limpiar localStorage antes de cada test
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login para limpiar el carrito si es necesario
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

            // Esperar a que el contenedor del carrito sea visible
            try {
                await page.waitForSelector('.carrito-container', { state: 'visible', timeout: 5000 });
            } catch (e) {
                // Si no aparece, puede que ya esté vacío o cargando
            }

            // Eliminar items mientras existan (bucle robusto)
            while (await page.locator('button:has-text("Eliminar")').count() > 0) {
                await page.locator('button:has-text("Eliminar")').first().click();
                await page.waitForTimeout(500); // Pausa para permitir actualización de UI
            }

            // Verificar limpieza (esperar mensaje de vacío)
            await expect(page.locator('h2:has-text("¡Tu carrito está vacío!")')).toBeVisible({ timeout: 10000 });

            // Logout
            await page.evaluate(() => localStorage.clear());
        }
    });

    test('Validar que el usuario puede agregar productos al carrito con perfil completo', async ({ page }) => {
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (!testEmail || !testPassword) {
            throw new Error('❌ Credenciales no configuradas en .env.test');
        }

        console.log('🧪 Iniciando prueba de agregar al carrito');

        // 1️⃣ Login con usuario de perfil completo
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        await page.fill('input[name="correo"]', testEmail);
        await page.fill('input[name="contraseña"]', testPassword);
        await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();

        await page.waitForURL('/', { timeout: 15000 });
        console.log('✅ Login exitoso');

        // 2️⃣ Navegar a la categoría tradicional para encontrar "Oreo"
        await page.locator('button:has-text("Tradicional"), a:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');
        console.log('✅ Navegado a productos tradicionales');

        // 3️⃣ Buscar y hacer click en el producto "Oreo"
        const productoOreo = page.locator('text=Oreo').first();
        await expect(productoOreo).toBeVisible({ timeout: 5000 });
        await productoOreo.click();

        // Esperar a que cargue la vista del producto
        await page.waitForLoadState('networkidle');
        console.log('✅ Vista de producto cargada');

        // 4️⃣ Verificar que estamos en la página del producto
        await expect(page.locator('h1:has-text("Oreo")')).toBeVisible({ timeout: 5000 });

        // 5️⃣ Verificar estado inicial del contador (debe estar vacío o sin paréntesis)
        const botonCarrito = page.locator('.header-buttons button:has-text("Carrito")');
        await expect(botonCarrito).toBeVisible();
        await expect(botonCarrito).not.toContainText('(');
        console.log('✅ Contador inicial verificado (vacío)');

        // 6️⃣ Click en "Agregar al carrito"
        const btnAgregarCarrito = page.locator('button:has-text("Agregar al carrito")');
        await expect(btnAgregarCarrito).toBeVisible({ timeout: 5000 });
        await btnAgregarCarrito.click();

        console.log('🔄 Click en "Agregar al carrito"');

        // 7️⃣ Esperar el toast de confirmación
        const toastExito = page.locator('text=¡Producto añadido al carrito!');
        await expect(toastExito).toBeVisible({ timeout: 10000 });
        console.log('✅ Toast de confirmación visible');

        // 8️⃣ Verificar que el contador del carrito se actualizó a (1)
        await expect(botonCarrito).toContainText('(1)', { timeout: 10000 });
        console.log('✅ Contador del carrito actualizado a (1)');

        // 9️⃣ Navegar al carrito para verificar que el producto está ahí
        await page.goto('/carrito');
        await page.waitForLoadState('networkidle');
        console.log('✅ Navegado al carrito');

        // 🔟 Verificar que "Oreo" está en el carrito
        const productoEnCarrito = page.locator('text=Oreo').first();
        await expect(productoEnCarrito).toBeVisible({ timeout: 5000 });
        console.log('✅ Producto "Oreo" encontrado en el carrito');

        // 1️⃣1️⃣ Captura de pantalla del carrito con el producto
        await page.screenshot({
            path: 'e2e/screenshots/CP-004-carrito-con-producto.png',
            fullPage: true
        });

        console.log('✅ Prueba CP-004 completada exitosamente');
    });

    test('Verificar que usuario no autenticado es redirigido a login', async ({ page }) => {
        console.log('🧪 Verificando redirección para usuario no autenticado');

        // Asegurar que no hay sesión
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // 1️⃣ Navegar directamente a un producto (sin login)
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // 2️⃣ Ir a productos tradicionales
        await page.locator('button:has-text("Tradicional"), a:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        // 3️⃣ Click en un producto
        const producto = page.locator('text=Oreo').first();
        await producto.click();
        await page.waitForLoadState('networkidle');

        // 4️⃣ Intentar agregar al carrito
        const btnAgregarCarrito = page.locator('button:has-text("Agregar al carrito")');
        await btnAgregarCarrito.click();

        // 5️⃣ Verificar que redirige a login (prioridad sobre el toast que puede desaparecer rápido)
        await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
        console.log('✅ Redirigido a página de login');

        // Opcional: Verificar si aparece algún mensaje, pero no fallar si la redirección fue muy rápida
        try {
            const toastLogin = page.locator('text=inicia sesión');
            if (await toastLogin.isVisible()) {
                console.log('✅ Toast de "inicia sesión" detectado');
            }
        } catch (e) {
            console.log('ℹ️ Toast no capturado (posible redirección rápida), pero la navegación fue correcta');
        }

        console.log('✅ Prueba de usuario no autenticado completada');
    });
});
