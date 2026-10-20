import { index, route, type RouteConfig } from '@react-router/dev/routes';

import {
  ADMIN,
  ANALYSIS,
  AUTH,
  CASE,
  COMMUNITY,
  FILE_ARCHIVE,
  PATIENT,
  PROXY_API,
  PROXY_YAC,
  STUDY,
  VARIANT,
} from './routes.module';

export default [
  route('health-check', './routes/health-check.tsx'),
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    ...VARIANT,
    ...CASE,
    ...FILE_ARCHIVE,
    ...ANALYSIS,
    ...ADMIN,
    ...PATIENT,
    ...STUDY,
    ...COMMUNITY,
  ]),
  index('./routes/tenant-redirect.tsx'),
  ...AUTH,
  ...PROXY_YAC,
  ...PROXY_API,
] satisfies RouteConfig;
