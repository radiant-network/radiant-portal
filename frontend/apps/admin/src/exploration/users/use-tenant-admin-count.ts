import useSWR from 'swr';

import type { ApiError } from '@/api/api';
import { usersApi } from '@/utils/api';

import { ADMIN_ROLE_CODE } from '../roles/roles-utils';

async function fetchAdminCount(tenant: string) {
  const response = await usersApi.listUsers(tenant, undefined, ADMIN_ROLE_CODE, 1);
  return response.data.count;
}

export function useTenantAdminCount(tenant: string, enabled: boolean) {
  return useSWR<number, ApiError>(enabled ? `admin-users-admin-count-${tenant}` : null, () => fetchAdminCount(tenant), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
