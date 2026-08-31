import useSWR from 'swr';

import { type ActionResponse, type ApiError, RoleActionResultScopeEnum } from '@/api/api';
import { actionsApi } from '@/utils/api';

export const ACTION_SCOPES = [RoleActionResultScopeEnum.Tenant, RoleActionResultScopeEnum.Org] as const;

async function fetchActions() {
  const response = await actionsApi.listActions();
  return response.data.filter((action: ActionResponse) => action.grantable);
}

export function useGrantableActions() {
  return useSWR<ActionResponse[], ApiError>('auth-grantable-actions', fetchActions, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
  });
}
