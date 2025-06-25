import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/utils': path.resolve(__dirname, '../../utils'),
      '@/components': path.resolve(__dirname, '../../components'),
      '@/base': path.resolve(__dirname, '../../components/base'),
      '@/lib': path.resolve(__dirname, '../../components/lib'),
      '@/hooks': path.resolve(__dirname, '../../components/hooks'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: '%name%',
      fileName: format => `%name%.${format}.js`,
    },
  },
});
