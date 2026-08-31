import useSWR from 'swr';

import type { ApiError, RoleResult } from '@/api/api';
import { rolesApi } from '@/utils/api';

async function fetchRoles(tenant: string) {
  const response = await rolesApi.listRoles(tenant);
  return response.data;
}

export function useTenantRoles(tenant: string) {
  return useSWR<RoleResult[], ApiError>(`admin-roles-${tenant}`, () => fetchRoles(tenant), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
