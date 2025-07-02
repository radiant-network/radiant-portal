import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { type PortalConfig } from '../../components/model/applications-config';
import radiantConfig from './config/radiant.json';
import kfConfig from './config/kf.json';

const configs: Record<string, PortalConfig> = {
  radiant: radiantConfig as PortalConfig,
  kf: kfConfig as PortalConfig,
};

const project = process.env.THEME || 'radiant';

export default defineConfig({
  define: {
    __PROJECT__: configs[project],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, `../../themes/${process.env.THEME}/assets`),
      '@styles/tailwind.css': path.resolve(__dirname, `../../themes/tailwind.base.css`),
      '@styles': path.resolve(__dirname, `../../themes/${process.env.THEME}`),
      '@translations': path.resolve(__dirname, '../../translations'),
    },
  },
  plugins: [reactRouter() as any, tsconfigPaths(), tailwindcss()],
});
