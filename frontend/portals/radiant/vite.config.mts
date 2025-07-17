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

// Plugin to replace dynamic imports for unused themes
const replaceUnusedThemeImports = () => {
  return {
    name: 'replace-unused-theme-imports',
    transform(code: string, id: string) {
      // Only process the i18n file
      if (id.includes('hooks/i18n.ts') || id.includes('hooks/i18n.js')) {
        // Replace the dynamic import pattern with theme-specific imports
        let transformedCode = code;
        
        const otherThemes = Object.keys(configs).filter(theme => theme !== project);
        
        // Replace the dynamic import with a conditional that only imports the current theme
        const dynamicImportPattern = /import\(`@translations\/portals\/\${theme}\/\${lang}\.json`\)/g;
        
        const replacement = `(async () => {
          if (theme === '${project}') {
            return import(\`@translations/portals/${project}/\${lang}.json\`);
          } else {
            // Return empty object for unused themes
            return { default: {} };
          }
        })()`;
        
        transformedCode = transformedCode.replace(dynamicImportPattern, replacement);
        
        if (transformedCode !== code) {
          console.log('🔄 Transformed i18n dynamic imports for theme:', project);
        }
        
        return {
          code: transformedCode,
          map: null,
        };
      }
      return null;
    },
  };
};

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
    },
  },
  plugins: [reactRouter() as any, tsconfigPaths(), tailwindcss(), replaceUnusedThemeImports()],
});
