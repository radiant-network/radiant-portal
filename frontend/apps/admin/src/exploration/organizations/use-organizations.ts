import useSWR from 'swr';

import type { ApiError, OrganizationResponse } from '@/api/api';
import { organizationsApi } from '@/utils/api';

async function fetchOrganizations(tenant: string) {
  const response = await organizationsApi.listOrganizations(tenant);
  return response.data;
}

export function useOrganizations(tenant: string) {
  return useSWR<OrganizationResponse[], ApiError>(`admin-organizations-${tenant}`, () => fetchOrganizations(tenant), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
