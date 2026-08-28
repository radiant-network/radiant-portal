import useSWR from 'swr';

import type { ApiError, RoleResult } from '@/api/api';
import { rolesApi } from '@/utils/api';

import { MEMBER_ROLE_CODE } from './roles-utils';

async function fetchMemberRole(tenant: string) {
  const response = await rolesApi.getRole(tenant, MEMBER_ROLE_CODE);
  return response.data;
}

export function useMemberRole(tenant: string) {
  return useSWR<RoleResult, ApiError>(`admin-role-${MEMBER_ROLE_CODE}-${tenant}`, () => fetchMemberRole(tenant), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
