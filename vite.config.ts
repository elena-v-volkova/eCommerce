import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTailwind from '@tailwindcss/vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTailwind()],
  base: '/',
  server: {
    open: '/',
    hmr: true
  },
  root: './src/',
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
