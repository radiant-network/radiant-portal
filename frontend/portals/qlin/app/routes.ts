import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('health-check', './routes/health-check.tsx'),
  // The tenant segment sits on the layout route itself, not on its children: useParams() in a
  // layout only sees its own match, so prefixing the leaves would leave TenantProvider blind.
  route(':tenant', './layout/protected-layout.tsx', [
    index('./routes/home.tsx'),
    route('variants/entity/:locusId', './routes/variants/entity.tsx'),
    route('case/', './routes/cases/list.tsx'),
    route('case/entity/:caseId', './routes/cases/entity.tsx'),
    route('file/', './routes/files/list.tsx'),
    route('analysis', './routes/analysis/list.tsx'),
    route('analysis/set-operations', './routes/analysis/set-operations.tsx'),
    route('admin/', './routes/admin/list.tsx'),
    route('admin/features', './routes/admin/beta-features.tsx'),
  ]),
  // The bare domain and the post-login redirect both land here.
  index('./routes/tenant-redirect.tsx'),
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
  ...prefix('api', [route('*?', './api/proxy.ts')]),
] satisfies RouteConfig;
