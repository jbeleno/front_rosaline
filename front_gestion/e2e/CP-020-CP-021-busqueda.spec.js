import { test, expect } from '@playwright/test';

test.describe('CP-020 - Búsqueda por texto parcial', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Verificar que la búsqueda retorna productos con texto parcial sin distinguir mayúsculas', async ({ page }) => {
        console.log('🧪 Iniciando prueba de búsqueda por texto parcial');

        // Buscar con minúsculas
        await page.locator('.header-search').fill('oreo');
        await page.waitForTimeout(500);
        console.log('🔍 Búsqueda: "oreo" (minúsculas)');

        // Verificar que aparece el dropdown
        await expect(page.locator('.search-dropdown.active')).toBeVisible({ timeout: 5000 });
        console.log('✅ Dropdown de búsqueda visible');

        // Verificar que "Oreo" aparece en los resultados
        await expect(page.locator('.search-dropdown-item:has-text("Oreo")')).toBeVisible({ timeout: 5000 });
        console.log('✅ "Oreo" encontrado en resultados');

        // Screenshot de resultados
        await page.screenshot({ path: 'e2e/screenshots/CP-020-busqueda-minusculas.png', fullPage: true });

        // Limpiar búsqueda
        await page.locator('.header-search').clear();
        await page.waitForTimeout(300);

        // Buscar con mayúsculas
        await page.locator('.header-search').fill('OREO');
        await page.waitForTimeout(500);
        console.log('🔍 Búsqueda: "OREO" (mayúsculas)');

        // Verificar que aparece el dropdown
        await expect(page.locator('.search-dropdown.active')).toBeVisible({ timeout: 5000 });

        // Verificar que "Oreo" aparece en los resultados
        await expect(page.locator('.search-dropdown-item:has-text("Oreo")')).toBeVisible({ timeout: 5000 });
        console.log('✅ "Oreo" encontrado con búsqueda en mayúsculas');

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-020-busqueda-mayusculas.png', fullPage: true });

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que la búsqueda funciona con texto parcial', async ({ page }) => {
        console.log('🧪 Verificando búsqueda con texto parcial');

        // Buscar solo "ore" (parte de "Oreo")
        await page.locator('.header-search').fill('ore');
        await page.waitForTimeout(500);
        console.log('🔍 Búsqueda: "ore" (texto parcial)');

        // Verificar que aparece el dropdown
        await expect(page.locator('.search-dropdown.active')).toBeVisible({ timeout: 5000 });

        // Verificar que "Oreo" aparece en los resultados
        await expect(page.locator('.search-dropdown-item:has-text("Oreo")')).toBeVisible({ timeout: 5000 });
        console.log('✅ "Oreo" encontrado con texto parcial "ore"');

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-020-busqueda-parcial.png', fullPage: true });

        console.log('✅ Búsqueda parcial funciona correctamente');
    });

    test('Verificar que búsqueda vacía no muestra dropdown', async ({ page }) => {
        console.log('🧪 Verificando que búsqueda vacía no muestra resultados');

        // Input vacío
        await page.locator('.header-search').fill('');
        await page.waitForTimeout(300);

        // Verificar que el dropdown NO está visible
        const dropdownVisible = await page.locator('.search-dropdown.active').isVisible().catch(() => false);
        expect(dropdownVisible).toBe(false);
        console.log('✅ Dropdown no visible con búsqueda vacía');

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que búsqueda sin resultados no muestra dropdown', async ({ page }) => {
        console.log('🧪 Verificando búsqueda sin resultados');

        // Buscar algo que no existe
        await page.locator('.header-search').fill('xyzabc123');
        await page.waitForTimeout(500);
        console.log('🔍 Búsqueda: "xyzabc123" (sin resultados)');

        // Verificar que el dropdown NO está visible
        const dropdownVisible = await page.locator('.search-dropdown.active').isVisible().catch(() => false);
        expect(dropdownVisible).toBe(false);
        console.log('✅ Dropdown no visible cuando no hay resultados');

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que al hacer click en un resultado navega al producto', async ({ page }) => {
        console.log('🧪 Verificando navegación al hacer click en resultado');

        // Buscar "Oreo"
        await page.locator('.header-search').fill('oreo');
        await page.waitForTimeout(500);

        // Verificar que aparece el dropdown
        await expect(page.locator('.search-dropdown.active')).toBeVisible({ timeout: 5000 });

        // Click en el primer resultado
        await page.locator('.search-dropdown-item').first().click();
        console.log('🖱️ Click en primer resultado');

        // Verificar que navega a la página del producto
        await page.waitForURL(/.*producto\/\d+/, { timeout: 5000 });
        console.log('✅ Navegó a la página del producto');

        // Verificar que el nombre del producto es visible
        await expect(page.locator('h1:has-text("Oreo")')).toBeVisible({ timeout: 5000 });
        console.log('✅ Página del producto cargada correctamente');

        // Screenshot
        await page.screenshot({ path: 'e2e/screenshots/CP-020-producto-desde-busqueda.png', fullPage: true });

        console.log('✅ Prueba completada exitosamente');
    });

    test('Verificar que muestra máximo 5 resultados', async ({ page }) => {
        console.log('🧪 Verificando límite de 5 resultados');

        // Buscar algo genérico que pueda tener muchos resultados
        await page.locator('.header-search').fill('a');
        await page.waitForTimeout(500);

        // Contar resultados
        const resultados = await page.locator('.search-dropdown-item').count();
        console.log(`📊 Resultados mostrados: ${resultados}`);

        // Verificar que no muestra más de 5
        expect(resultados).toBeLessThanOrEqual(5);
        console.log('✅ No muestra más de 5 resultados');

        console.log('✅ Prueba completada exitosamente');
    });
});
