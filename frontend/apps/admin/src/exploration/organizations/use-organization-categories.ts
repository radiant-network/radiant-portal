import useSWR from 'swr';

import type { ValueSetItem } from '@/api/api';
import { valueSetsApi } from '@/utils/api';

const CATEGORY_VALUE_SET = 'organization_category';

async function fetchCategories() {
  const response = await valueSetsApi.listValueSet(CATEGORY_VALUE_SET);
  return response.data;
}

export function useOrganizationCategories() {
  return useSWR<ValueSetItem[]>(`value-set-${CATEGORY_VALUE_SET}`, fetchCategories, {
    revalidateOnFocus: false,
    // A value set barely ever changes: once cached, mounting another consumer must not refetch.
    revalidateIfStale: false,
    shouldRetryOnError: false,
  });
}
