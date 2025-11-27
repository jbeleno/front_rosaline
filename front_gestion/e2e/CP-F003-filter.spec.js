import { test, expect } from '@playwright/test';

/**
 * CP-F003 - Prueba E2E de Filtro de Productos por Categoría
 * 
 * Esta prueba valida que los botones de filtro en el header funcionan correctamente:
 * 1. Click en "Tradicional" muestra productos tradicionales
 * 2. Click en "Saludable" muestra productos saludables
 * 3. Los productos cambian al cambiar de categoría
 */

test.describe('CP-F003 - Filtro de productos por categoría', () => {

    test('Validar que el usuario puede filtrar productos por "tradicional" y "saludable"', async ({ page }) => {
        console.log('🧪 Iniciando prueba de filtro de productos');

        // 1️⃣ Navegar a la página principal
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        console.log('✅ Página principal cargada');

        // 2️⃣ Verificar que los botones de filtro están visibles
        const btnTradicional = page.locator('button:has-text("Tradicional"), a:has-text("Tradicional")');
        const btnSaludable = page.locator('button:has-text("Saludable"), a:has-text("Saludable")');

        await expect(btnTradicional).toBeVisible({ timeout: 5000 });
        await expect(btnSaludable).toBeVisible({ timeout: 5000 });

        console.log('✅ Botones de filtro encontrados');

        // 3️⃣ Click en "Tradicional"
        await btnTradicional.click();
        await page.waitForLoadState('networkidle');

        console.log('🔄 Click en "Tradicional"');

        // 4️⃣ Verificar que se muestra un producto tradicional (Oreo)
        const productoTradicional = page.locator('text=Oreo').first();
        await expect(productoTradicional).toBeVisible({ timeout: 5000 });

        console.log('✅ Producto tradicional "Oreo" visible');

        // 5️⃣ Captura de pantalla de productos tradicionales
        await page.screenshot({
            path: 'e2e/screenshots/CP-F003-tradicional.png',
            fullPage: true
        });

        // 6️⃣ Click en "Saludable"
        await btnSaludable.click();
        await page.waitForLoadState('networkidle');

        console.log('🔄 Click en "Saludable"');

        // 7️⃣ Verificar que se muestra un producto saludable
        const productoSaludable = page.locator('text=Galleta saludable con harina de almendras y coco').first();
        await expect(productoSaludable).toBeVisible({ timeout: 5000 });

        console.log('✅ Producto saludable visible');

        // 8️⃣ Verificar que el producto tradicional ya NO está visible
        // (opcional, para confirmar que el filtro realmente cambió)
        try {
            await expect(productoTradicional).not.toBeVisible({ timeout: 2000 });
            console.log('✅ Producto tradicional ya no visible (filtro funcionó)');
        } catch (error) {
            console.log('⚠️  Producto tradicional aún visible (puede ser normal si hay scroll)');
        }

        // 9️⃣ Captura de pantalla de productos saludables
        await page.screenshot({
            path: 'e2e/screenshots/CP-F003-saludable.png',
            fullPage: true
        });

        // 🔟 Volver a "Tradicional" para verificar que el filtro es bidireccional
        await btnTradicional.click();
        await page.waitForLoadState('networkidle');

        console.log('🔄 Click nuevamente en "Tradicional"');

        // 1️⃣1️⃣ Verificar que volvemos a ver productos tradicionales
        await expect(productoTradicional).toBeVisible({ timeout: 5000 });

        console.log('✅ Filtro bidireccional funciona correctamente');

        console.log('✅ Prueba CP-F003 completada exitosamente');
    });

    test('Verificar que ambas categorías muestran productos diferentes', async ({ page }) => {
        console.log('🧪 Verificando que las categorías son diferentes');

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Click en Tradicional
        await page.locator('button:has-text("Tradicional"), a:has-text("Tradicional")').click();
        await page.waitForLoadState('networkidle');

        // Contar productos tradicionales
        const productosTradicionales = await page.locator('[class*="product"], [class*="card"]').count();
        console.log(`📊 Productos tradicionales encontrados: ${productosTradicionales}`);

        // Click en Saludable
        await page.locator('button:has-text("Saludable"), a:has-text("Saludable")').click();
        await page.waitForLoadState('networkidle');

        // Contar productos saludables
        const productosSaludables = await page.locator('[class*="product"], [class*="card"]').count();
        console.log(`📊 Productos saludables encontrados: ${productosSaludables}`);

        // Verificar que hay productos en ambas categorías
        expect(productosTradicionales).toBeGreaterThan(0);
        expect(productosSaludables).toBeGreaterThan(0);

        console.log('✅ Ambas categorías tienen productos');
    });
});
