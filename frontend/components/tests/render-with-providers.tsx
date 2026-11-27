import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from 'vitest-browser-react';

import { TooltipProvider } from '@/components/base/shadcn/tooltip';
import { ConfigProvider, type PortalConfig } from '@/components/cores/applications-config';
import { TenantContext } from '@/components/hooks/use-tenant';

import i18n from '../.storybook/i18n';

export const TEST_TENANT = 'radiant';

type RenderOptions = {
  config: PortalConfig;
  /** Route id whose loader data the component reads with `useRouteLoaderData`. */
  routeId?: string;
  loaderData?: unknown;
};

export function renderWithProviders(ui: ReactElement, { config, routeId = 'root', loaderData = null }: RenderOptions) {
  const router = createMemoryRouter([{ id: routeId, path: '/', loader: () => loaderData, element: ui }]);

  return render(
    <I18nextProvider i18n={i18n}>
      <TenantContext.Provider
        value={{ tenant: TEST_TENANT, tenants: [], setTenant: async () => {}, refreshPermissions: async () => {} }}
      >
        <ConfigProvider config={config}>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ConfigProvider>
      </TenantContext.Provider>
    </I18nextProvider>,
  );
}
