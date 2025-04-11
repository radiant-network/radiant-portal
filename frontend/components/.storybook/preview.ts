import type { Preview } from '@storybook/react';
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

export default preview;
