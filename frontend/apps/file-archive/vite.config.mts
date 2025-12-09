import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/base': path.resolve(__dirname, '../../components/base'),
      '@/components': path.resolve(__dirname, '../../components'),
      '@/hooks': path.resolve(__dirname, '../../components/hooks'),
      '@/lib': path.resolve(__dirname, '../../components/lib'),
      '@/portals': path.resolve(__dirname, '../../portals'),
      '@/utils': path.resolve(__dirname, '../../utils'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: 'file-archive',
      fileName: format => `file-archive.${format}.js`,
    },
  },
});
