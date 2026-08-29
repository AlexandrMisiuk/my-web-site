import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        target: 'baseline-widely-available',
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
        css: false,
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/main.tsx', 'src/test/**', 'src/data/**', 'src/**/*.d.ts', 'src/**/*.{test,spec}.{ts,tsx}'],
            thresholds: {
                lines: 100,
                statements: 100,
                functions: 100,
                branches: 100,
            },
        },
    },
});
