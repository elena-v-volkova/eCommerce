import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: '/',
    server: {
        open: '/',
        hmr: true,
    },
    build: {
        emptyOutDir: true,
    },
    root: './src/',
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    envDir: '../',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
        },
        exclude: [], //exclude test files
    },
});
