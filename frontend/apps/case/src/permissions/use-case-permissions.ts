import useFeatureFlags from '@/components/hooks/use-feature-flags';
import { ORG_ACTIONS, useHasAnyTenantAction, useHasOrgAction } from '@/components/hooks/use-tenant';

const SEARCH_CASE_ACTION = 'can_search_case';

/** Case-level permissions, keyed by the org that owns the case. */
export function useCanEditCase(diagnosisLabCode?: string): boolean {
  return useHasOrgAction(ORG_ACTIONS.editCase, diagnosisLabCode);
}

export function useCanDownloadVariantsReport(): boolean {
  const { caseVariantsReport } = useFeatureFlags();
  const canSearchCase = useHasAnyTenantAction([SEARCH_CASE_ACTION]);
  return caseVariantsReport && canSearchCase;
}
