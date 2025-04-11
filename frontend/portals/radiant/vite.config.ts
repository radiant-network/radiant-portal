import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

import { type AppsConfig, type PortalConfig } from '../../components/model/applications-config';
import radiantConfig from './config/radiant.json';
import kfConfig from './config/kf.json';

const configs: Record<string, PortalConfig> = {
  radiant: radiantConfig as PortalConfig,
  kf: kfConfig as PortalConfig,
};

const project = process.env.THEME || 'radiant';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  define: {
    __PROJECT__: configs[project],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, `../../themes/${process.env.THEME}/assets`),
      '@styles/common.css': path.resolve(__dirname, `../../themes/common.css`),
      '@styles': path.resolve(__dirname, `../../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../../translations'),
    },
  },
  plugins: [reactRouter() as any, tsconfigPaths()],
});
