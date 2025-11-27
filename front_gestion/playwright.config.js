import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.test
dotenv.config({ path: '.env.test' });

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',

    /* Tiempo máximo de ejecución por test */
    timeout: parseInt(process.env.E2E_TIMEOUT || '30000'),

    /* Configuración de expect */
    expect: {
        timeout: 5000
    },

    /* Ejecutar tests en paralelo */
    fullyParallel: false,

    /* Fallar si hay tests marcados como .only */
    forbidOnly: !!process.env.CI,

    /* Reintentos en caso de fallo */
    retries: process.env.CI ? 2 : 0,

    /* Número de workers (tests en paralelo) */
    workers: process.env.CI ? 1 : 1,

    /* Reporter: lista en consola, HTML para ver resultados */
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report' }]
    ],

    /* Configuración compartida para todos los proyectos */
    use: {
        /* URL base de la aplicación */
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

        /* Capturar screenshot solo en fallos */
        screenshot: 'only-on-failure',

        /* Grabar video solo en fallos */
        video: 'retain-on-failure',

        /* Capturar trace solo en fallos */
        trace: 'retain-on-failure',

        /* Modo headless */
        headless: process.env.E2E_HEADLESS === 'true',
    },

    /* Configurar proyectos para diferentes navegadores */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // Descomenta para probar en otros navegadores
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    /* Servidor de desarrollo (opcional) */
    // Si quieres que Playwright inicie el servidor automáticamente
    // webServer: {
    //   command: 'npm start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120000,
    // },
});
