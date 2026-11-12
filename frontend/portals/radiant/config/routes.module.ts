import { prefix, route, type RouteConfigEntry } from '@react-router/dev/routes';

import type { AppName, ExtraName, LandingName } from './catalog';

export const APP_ROUTES = {
  VARIANT: [route('variants/entity/:locusId', './routes/variants/entity.tsx')],
  CASE: [route('case/', './routes/cases/list.tsx'), route('case/entity/:caseId', './routes/cases/entity.tsx')],
  FILE_ARCHIVE: [route('file/', './routes/files/list.tsx')],
  ANALYSIS: [
    route('analysis', './routes/analysis/list.tsx'),
    route('analysis/set-operations', './routes/analysis/set-operations.tsx'),
  ],
  ADMIN: [route('admin/', './routes/admin/list.tsx'), route('admin/features', './routes/admin/beta-features.tsx')],
  PATIENT: [
    route('patient/', './routes/patients/list.tsx'),
    route('patient/entity/:patientId', './routes/patients/entity.tsx'),
  ],
  STUDY: [route('study/', './routes/studies/list.tsx')],
  COMMUNITY: [route('community/', './routes/community/list.tsx')],
} satisfies Record<AppName, RouteConfigEntry[]>;

export const LANDING_PAGES = {
  INCLUDE: './routes/landing/include.tsx',
  KIDSFIRST: './routes/landing/kidsfirst.tsx',
} satisfies Record<LandingName, string>;

export const EXTRA_ROUTES = {
  PROXY_YAC: prefix('api', [route('yac/*?', './api/yac-proxy.ts')]),
} satisfies Record<ExtraName, RouteConfigEntry[]>;

export const AUTH = [
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
];

export const PROXY_API = prefix('api', [route('*?', './api/proxy.ts')]);
