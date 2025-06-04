import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, `../themes/${process.env.THEME}/assets`),
      '@styles/common.css': path.resolve(__dirname, `../themes/common.css`),
      '@styles': path.resolve(__dirname, `../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../translations'),
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: 'variant',
      fileName: format => `variant.${format}.js`,
    },
  },
});
