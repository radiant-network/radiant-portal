import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import type { CaseGroupResponse, SearchCriterion } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { caseGroupsApi } from '@/utils/api';

export const CASE_GROUP_PARAM = 'case_group';

async function fetchCaseGroup(tenant: string, name: string) {
  const response = await caseGroupsApi.getCaseGroup(tenant, name);
  return response.data;
}

function getCaseGroupCriterion(name: string): SearchCriterion {
  return { field: CASE_GROUP_PARAM, operator: 'in', value: [name] };
}

function useCaseGroup() {
  const { tenant } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get(CASE_GROUP_PARAM);

  const { data: caseGroup, error } = useSWR<CaseGroupResponse>(
    name ? ['case-group', tenant, name] : null,
    () => fetchCaseGroup(tenant, name!),
    { revalidateOnFocus: false },
  );

  const remove = useCallback(() => {
    setSearchParams(
      params => {
        params.delete(CASE_GROUP_PARAM);
        return params;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return {
    name,
    criterion: name ? getCaseGroupCriterion(name) : undefined,
    createdOn: caseGroup?.created_on,
    isLoading: !!name && !caseGroup && !error,
    remove,
  };
}

export default useCaseGroup;
