import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  route('health-check', './routes/health-check.tsx'),
  layout('./layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    route('variants/entity/:locusId', './routes/variants/entity.tsx'),
    route('case-exploration/', './routes/cases/list.tsx'),
    route('admin/features', './routes/admin/beta-features.tsx'),
  ]),
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
  ...prefix('api', [route('*?', './api/proxy.ts')]),
] satisfies RouteConfig;
