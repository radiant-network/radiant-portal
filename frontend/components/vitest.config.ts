import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.mts';

// Set by scripts/test-storybook-docker.sh so screenshots come from the Playwright image, not the host browser.
const wsEndpoint = process.env.PW_WS_ENDPOINT;

const BROWSER_TEST = '**/*.browser.test.tsx';

// A factory: Vitest mutates the instances it receives, so projects must not share them.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(wsEndpoint ? { connectOptions: { wsEndpoint } } : {}),
  instances: [{ browser: 'chromium' as const }],
  viewport: { width: 1280, height: 720 },
});

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['**/*.test.{ts,tsx}'],
            exclude: [...configDefaults.exclude, BROWSER_TEST],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: '.storybook', tags: { include: ['vitest'] } })],
          test: {
            name: 'storybook',
            setupFiles: ['.storybook/vitest.setup.ts'],
            browser: browser(),
          },
        },
        {
          extends: true,
          publicDir: 'stories/public',
          test: {
            name: 'browser',
            include: [`../apps/${BROWSER_TEST}`, BROWSER_TEST],
            exclude: [...configDefaults.exclude],
            setupFiles: ['tests/setup-browser.ts'],
            browser: browser(),
          },
        },
      ],
    },
  }),
);
