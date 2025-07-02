import '@styles/theme.css';
import '@styles/tailwind.css';

import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { TooltipProvider } from '../base/ui/tooltip';
import { AlertDialogProvider } from '../base/dialog/alert-dialog-provider';
import { I18nProvider } from '../hooks/I18nProvider';
import ThemeProvider from '../feature/theme-toggle/theme-provider';

const preview: Preview = {
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
    Story => (
      <I18nProvider>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <AlertDialogProvider>
              <Story />
            </AlertDialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </I18nProvider>
    ),
  ],
};

export default preview;
