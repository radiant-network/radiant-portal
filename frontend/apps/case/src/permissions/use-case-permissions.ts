import { ORG_ACTIONS, useHasOrgAction } from '@/components/hooks/use-tenant';

/** Case-level permissions, keyed by the org that owns the case. */
export function useCanEditCase(diagnosisLabCode?: string): boolean {
  return useHasOrgAction(ORG_ACTIONS.editCase, diagnosisLabCode);
}
