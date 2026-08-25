import useSWR from 'swr';

import type { ApiError, RoleResult } from '@/api/api';
import { rolesApi } from '@/utils/api';

async function fetchRoles(tenant: string) {
  const response = await rolesApi.listRoles(tenant);
  return response.data;
}

/**
 * The tenant's role catalog — seeded roles and the tenant's own — each with the actions it grants.
 */
export function useTenantRoles(tenant: string) {
  return useSWR<RoleResult[], ApiError>(`admin-roles-${tenant}`, () => fetchRoles(tenant), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
  });
}
