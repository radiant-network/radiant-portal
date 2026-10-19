import { index, route, type RouteConfig } from '@react-router/dev/routes';

import { ADMIN, ANALYSIS, AUTH, CASE, FILE_ARCHIVE, PROXY_API, VARIANT } from './routes.module';

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...VARIANT,
    ...CASE,
    ...FILE_ARCHIVE,
    ...ANALYSIS,
    ...ADMIN,
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...AUTH,
  ...PROXY_API,
] satisfies RouteConfig;
