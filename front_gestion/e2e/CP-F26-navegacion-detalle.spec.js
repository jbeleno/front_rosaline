import { test, expect } from '@playwright/test';

test.describe('CP-F26 - Navegación de tarjeta de producto a detalle', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Verificar navegación desde Categoría a Detalle de Producto', async ({ page }) => {
        console.log('🧪 Verificando navegación desde filtro de categoría');

        // 1. Ir a una categoría específica para tener resultados deterministas
        await page.locator('button:has-text("Tradicional")').click();
        await page.waitForTimeout(1000); // Esperar filtrado

        // 2. Click en el primer producto disponible
        const productCard = page.locator('.producto-card').first();
        await expect(productCard).toBeVisible();

        const productName = await productCard.locator('h3').textContent();
        console.log(`📦 Producto de categoría seleccionado: ${productName}`);

        await productCard.click();

        // 3. Verificar navegación
        await expect(page).toHaveURL(/\/producto\/\d+/);

        // Verificar que el título coincide (Selector corregido: h1 dentro de .vista-producto-info)
        const detailTitle = await page.locator('.vista-producto-info h1').textContent();
        expect(detailTitle?.trim()).toBe(productName?.trim());

        console.log('✅ Navegación desde categoría exitosa');
    });

    test('Verificar navegación desde botón "Explorar productos" del carrito vacío', async ({ page }) => {
        console.log('🧪 Verificando navegación desde carrito vacío');

        // 1. Login para acceder al carrito
        const testEmail = process.env.E2E_TEST_USER_EMAIL;
        const testPassword = process.env.E2E_TEST_USER_PASSWORD;

        if (testEmail && testPassword) {
            await page.goto('/login');
            await page.fill('input[name="correo"]', testEmail);
            await page.fill('input[name="contraseña"]', testPassword);
            await page.locator('form button[type="submit"]:has-text("Iniciar sesión")').click();
            await page.waitForURL('/', { timeout: 15000 });

            // 2. Ir al carrito y limpiarlo
            await page.goto('/carrito');
            await page.waitForLoadState('networkidle');

            const botonesEliminar = page.locator('button:has-text("Eliminar")');
            const deleteCount = await botonesEliminar.count();

            for (let i = 0; i < deleteCount; i++) {
                await page.locator('button:has-text("Eliminar")').first().click();
                await page.waitForTimeout(500);
            }

            // 3. Verificar botón "Explorar productos"
            const exploreButton = page.locator('button:has-text("Explorar productos")');
            await expect(exploreButton).toBeVisible();

            // 4. Click en Explorar
            await exploreButton.click();
            await expect(page).toHaveURL(/.*\/productos/);
            console.log('✅ Redirección a /productos exitosa');

            // 5. Click en un producto desde la vista general
            console.log('⏳ Esperando carga de productos...');
            await page.waitForSelector('.producto-card', { state: 'visible', timeout: 15000 });

            // Asegurar que hay al menos un producto
            const productCount = await page.locator('.producto-card').count();
            console.log(`📦 Productos encontrados: ${productCount}`);
            expect(productCount).toBeGreaterThan(0);

            const productCard = page.locator('.producto-card').first();
            // CORRECCIÓN: Usar h2.producto-nombre en lugar de h3
            const productName = await productCard.locator('h2.producto-nombre').textContent();

            // Scroll y click forzado en la imagen para asegurar navegación
            await productCard.scrollIntoViewIfNeeded();
            await productCard.locator('img').click({ force: true });

            // 6. Validar detalle
            console.log('⏳ Esperando navegación a detalle...');
            await expect(page).toHaveURL(/\/producto\/\d+/, { timeout: 10000 });

            // Verificar título con selector corregido
            const detailTitle = await page.locator('.vista-producto-info h1').textContent();
            expect(detailTitle?.trim()).toBe(productName?.trim());

            console.log('✅ Navegación final a detalle exitosa');
        } else {
            console.log('⚠️ Saltando test por falta de credenciales');
        }
    });
});
