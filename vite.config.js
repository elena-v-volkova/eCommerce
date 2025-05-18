import { defineConfig } from 'vite';
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
    root: './src/',
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    envDir: '../',
});
