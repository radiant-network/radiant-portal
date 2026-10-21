import { index, route, type RouteConfig } from '@react-router/dev/routes';

import type { BundleDefinition } from '../config/catalog';
import { APP_ROUTES, AUTH, EXTRA_ROUTES, LANDING_PAGES, PROXY_API } from '../config/routes.module';
import { type ThemeName, THEMES } from '../config/themes';

const theme: BundleDefinition = THEMES[(process.env.THEME ?? 'radiant') as ThemeName];

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...theme.apps.flatMap(app => APP_ROUTES[app]),
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...(theme.landing ? [route('landing', LANDING_PAGES[theme.landing])] : []),
  ...theme.extras.flatMap(extra => EXTRA_ROUTES[extra]),
  ...AUTH,
  ...PROXY_API,
] satisfies RouteConfig;
