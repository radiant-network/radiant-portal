import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('health-check', './routes/health-check.tsx'),
  layout('./layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    route('variants/entity/:locusId', './routes/variants/entity.tsx'),
    route('case/', './routes/cases/list.tsx'),
    route('case/entity/:caseId', './routes/cases/entity.tsx'),
    route('file/', './routes/files/list.tsx'),
    route('study/', './routes/studies/list.tsx'),
    route('community/', './routes/community/list.tsx'),
    route('analysis', './routes/analysis/list.tsx'),
    route('analysis/set-operations', './routes/analysis/set-operations.tsx'),
    route('admin/features', './routes/admin/beta-features.tsx'),
  ]),
  // POC: side-by-side comparison of the two CharmX embedding strategies. Outside
  // the protected layout on purpose — it needs a session but not a tenant, so it
  // runs without the API/Postgres stack. It does its own requireAuth.
  route('poc/charmx', './routes/poc/charmx.tsx'),
  // QA preview only: two explicit URLs let both landing variants be viewed in a single build.
  // In prod this should collapse to a single THEME-driven `/landing` (and remove these routes
  // plus the matching beta-feature links).
  route('landing/include', './routes/landing/include.tsx'),
  route('landing/kidsfirst', './routes/landing/kidsfirst.tsx'),
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
  ...prefix('api', [route('*?', './api/proxy.ts')]),
  // Outside the protected layout on purpose: this returns CharmX's own HTML, so
  // it must not be wrapped in the portal's navbar/providers.
  ...prefix('charmx-proxy', [route('*?', './api/charmx-proxy.ts')]),
] satisfies RouteConfig;
