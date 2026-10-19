import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

import type { PortalConfig } from '../../components/cores/applications-config';

import { computeApps } from './compute-apps';
import { includeConfig } from './config/include';
import { kfConfig } from './config/kf';
import { qlinConfig } from './config/qlin';
import { radiantConfig } from './config/radiant';
import { createMergeTranslationsPlugin } from '../../utils/merge-translations';

const configs: Record<string, PortalConfig> = {
  radiant: radiantConfig,
  include: includeConfig,
  kf: kfConfig,
  qlin: qlinConfig,
};

const project = process.env.THEME || 'radiant';

export default defineConfig({
  define: {
    __PROJECT__: configs[project],
    __THEME__: JSON.stringify(project),
    'import.meta.env.THEME': JSON.stringify(project),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    ...computeApps(project, __dirname),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@assets': path.resolve(__dirname, `../../themes/${process.env.THEME}/assets`),
      '@styles/tailwind.css': path.resolve(__dirname, `../../themes/tailwind.base.css`),
      '@styles': path.resolve(__dirname, `../../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../../translations'),
      '@translations-merged': path.resolve(__dirname, `../../translations/merged/${project}`),
    },
  },
  plugins: [reactRouter() as any, tailwindcss(), createMergeTranslationsPlugin(project, __dirname)],
});
