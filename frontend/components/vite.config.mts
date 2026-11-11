import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, `../themes/${process.env.THEME}/assets`),
      '@styles/tailwind.css': path.resolve(__dirname, `../themes/tailwind.base.css`),
      '@styles': path.resolve(__dirname, `../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../translations'),
    },
  },
  plugins: [react(), tailwindcss()],
});
