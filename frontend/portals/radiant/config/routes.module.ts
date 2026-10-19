import { prefix, route } from '@react-router/dev/routes';

export const VARIANT = [route('variants/entity/:locusId', './routes/variants/entity.tsx')];

export const CASE = [
  route('case/', './routes/cases/list.tsx'),
  route('case/entity/:caseId', './routes/cases/entity.tsx'),
];

export const FILE_ARCHIVE = [route('file/', './routes/files/list.tsx')];

export const ANALYSIS = [
  route('analysis', './routes/analysis/list.tsx'),
  route('analysis/set-operations', './routes/analysis/set-operations.tsx'),
];

export const ADMIN = [
  route('admin/', './routes/admin/list.tsx'),
  route('admin/features', './routes/admin/beta-features.tsx'),
];

export const PATIENT = [
  route('patient/', './routes/patients/list.tsx'),
  route('patient/entity/:patientId', './routes/patients/entity.tsx'),
];

export const STUDY = [route('study/', './routes/studies/list.tsx')];

export const COMMUNITY = [route('community/', './routes/community/list.tsx')];

export const LANDING_INCLUDE = [route('landing/include', './routes/landing/include.tsx')];

export const LANDING_KIDSFIRST = [route('landing/kidsfirst', './routes/landing/kidsfirst.tsx')];

export const AUTH = [
  route('auth/callback', './routes/auth/callback.ts'),
  route('auth/logout', './routes/auth/logout.ts'),
  route('auth/refresh-token', './api/refresh-token.ts'),
];

export const PROXY_YAC = prefix('api', [route('yac/*?', './api/yac-proxy.ts')]);

export const PROXY_API = prefix('api', [route('*?', './api/proxy.ts')]);
