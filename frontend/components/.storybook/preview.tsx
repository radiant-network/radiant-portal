import '@styles/theme.css';
import '@styles/tailwind.css';

import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { TooltipProvider } from '../base/ui/tooltip';
import { AlertDialogProvider } from '../base/dialog/alert-dialog-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Use the Storybook-specific i18n instance
import ThemeProvider from '../feature/theme-toggle/theme-provider';

// 
let options = {};
console.log(`Currently hosted on ${location.hostname}`);
if (location.hostname === 'radiant-network.github.io') {
  console.log('Configure MSW service worker for radiant-network.github.io');
  options = {
    serviceWorker: {
      url: '/docs/mockServiceWorker.js',
    },
  };
}

initialize(options);

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
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
