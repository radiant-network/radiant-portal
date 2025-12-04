import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { type PortalConfig } from '../../components/model/applications-config';

import kfConfig from './config/kf.json';
import radiantConfig from './config/radiant.json';
import { createMergeTranslationsPlugin } from './merge-translations';

const configs: Record<string, PortalConfig> = {
  radiant: radiantConfig as PortalConfig,
  kf: kfConfig as unknown as PortalConfig,
};

const project = process.env.THEME || 'radiant';

export default defineConfig({
  define: {
    __PROJECT__: configs[project],
    __THEME__: JSON.stringify(project),
    'import.meta.env.THEME': JSON.stringify(project),
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, `../../themes/${process.env.THEME}/assets`),
      '@styles/tailwind.css': path.resolve(__dirname, `../../themes/tailwind.base.css`),
      '@styles': path.resolve(__dirname, `../../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../../translations'),
      '@translations-merged': path.resolve(__dirname, `../../translations/merged/${project}`),
    },
  },
  plugins: [reactRouter() as any, tsconfigPaths(), tailwindcss(), createMergeTranslationsPlugin(project, __dirname)],
});
