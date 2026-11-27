import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/components': fileURLToPath(new URL('./components', import.meta.url)),
      '@/lib': fileURLToPath(new URL('./components/lib', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./utils', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, '**/*.browser.test.tsx'],
  },
});
