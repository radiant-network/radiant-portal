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
    route('admin/features', './routes/admin/beta-features.tsx'),
  ]),
  // QA preview only: two explicit URLs let both landing variants be viewed in a single build.
  // In prod this should collapse to a single THEME-driven `/landing` (and remove these routes
  // plus the matching beta-feature links).
  route('landing/include', './routes/landing/include.tsx'),
  route('landing/kidsfirst', './routes/landing/kidsfirst.tsx'),
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
  ...prefix('api', [route('*?', './api/proxy.ts')]),
] satisfies RouteConfig;
