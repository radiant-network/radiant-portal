import { useCallback } from 'react';
import { type NavigateOptions, useNavigate } from 'react-router';

import { useTenant } from './use-tenant';

/** Prefixes an app path with the global route segments (tenant): localPath('/case') -> '/radiant/case'. */
export function useLocalPath() {
  const { tenant } = useTenant();
  return useCallback((path: string) => `/${tenant}${path === '/' ? '' : path}`, [tenant]);
}

/** useNavigate for app paths, prefixed with localPath. Use useNavigate directly for history moves (-1). */
export function useLocalNavigation() {
  const navigate = useNavigate();
  const localPath = useLocalPath();
  return useCallback(
    (path: string, options?: NavigateOptions) => navigate(localPath(path), options),
    [navigate, localPath],
  );
}
