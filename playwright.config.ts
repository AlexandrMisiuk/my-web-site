import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL,
        trace: 'on-first-retry',
        contextOptions: {
            reducedMotion: 'reduce',
        },
    },
    projects: [
        {
            name: 'desktop-1440',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
        },
        {
            name: 'tablet-768',
            use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
        },
        {
            name: 'mobile-320',
            use: { ...devices['Pixel 5'], viewport: { width: 320, height: 640 } },
        },
    ],
    webServer: {
        command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
