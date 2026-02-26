import '@styles/theme.css';
import '@styles/tailwind.css';

import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { TooltipProvider } from '../base/shadcn/tooltip';
import { AlertDialogProvider } from '../base/dialog/alert-dialog-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Use the Storybook-specific i18n instance
import ThemeProvider from '../base/theme-toggle/theme-provider';
import { sb } from 'storybook/test';

// mock
sb.mock(import('../../utils/helper.ts'), { spy: true });

let options = {};
if (location.hostname === 'radiant-network.github.io') {
  console.log(`Configure MSW service worker for radiant-network.github.io`);
  options = {
    serviceWorker: {
      url: './mockServiceWorker.js',
    },
  };
}

initialize(options);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    Story => (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <AlertDialogProvider>
              <Story />
            </AlertDialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
