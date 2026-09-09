import '@styles/theme.css';
import '@styles/tailwind.css';

import { Suspense, useEffect } from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { TooltipProvider } from '../base/shadcn/tooltip';
import { AlertDialogProvider } from '../base/dialog/alert-dialog-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Use the Storybook-specific i18n instance
import ThemeProvider from '../base/theme-toggle/theme-provider';
import { sb } from 'storybook/test';
import { setDefaultOptions } from 'date-fns';
import { enUS, frCA } from 'date-fns/locale';
import { axiosClient } from '../../utils/axios';
import { TenantContext } from '../hooks/use-tenant';
import { BetaFeatureProvider } from '../hooks/beta-feature-provider';

// Every API path is tenant-scoped (`/{tenant}/...`). Without a provider the context falls back to an
// empty tenant, the client emits `/api//...` and no MSW handler matches, leaving stories stuck
// loading. Stories needing their own tenants nest their provider inside this one.
const STORYBOOK_TENANT = 'radiant';

// mock
sb.mock(import('../../utils/helper.ts'), { spy: true });

let options = {};
if (location.hostname === 'radiant-network.github.io') {
  console.log(`Configure MSW service worker for radiant-network.github.io`);
  // Storybook is served under /radiant-portal/storybook/, which limits the MSW
  // service worker scope to that subpath. Prefix axios requests so they fall
  // within the SW scope and match the relative handler URLs registered by MSW.
  axiosClient.defaults.baseURL = '/radiant-portal/storybook/api';
  options = {
    serviceWorker: {
      url: './mockServiceWorker.js',
    },
  };
}

// Locale switcher
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'fr', title: 'French' },
      ],
      showName: true,
    },
  },
};

// Locale decorators
// @ts-ignore
const withI18next = (Story, context) => {
  const { locale } = context.globals;

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18n.changeLanguage(locale);

    switch (locale) {
      case 'fr':
        setDefaultOptions({ locale: frCA });
        break;
      default:
        setDefaultOptions({ locale: enUS });
    }
  }, [locale]);

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};

initialize(options);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Foundations', 'Components', 'Features', 'Layout', 'Utils', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [
    withI18next,
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
          <TooltipProvider>
            <AlertDialogProvider>
              <TenantContext.Provider value={{ tenant: STORYBOOK_TENANT, tenants: [], setTenant: async () => {} }}>
                <BetaFeatureProvider>
                  <Story />
                </BetaFeatureProvider>
              </TenantContext.Provider>
            </AlertDialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
