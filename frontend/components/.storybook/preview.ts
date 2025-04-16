import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import './index.css';
import '@styles/common.css';
import '@styles/main.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

export default preview;
