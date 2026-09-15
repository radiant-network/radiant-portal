import { useContext } from 'react';

import { ORG_ACTIONS, useHasOrgAction } from '@/components/hooks/use-tenant';

import { CaseEntityContext } from '../case-entity-context';

export type CaseVariantPermissions = {
  canInterpret: boolean;
  canComment: boolean;
  canFlag: boolean;
};

/**
 * Variant-level permissions for the case on screen.
 */
export function useCaseVariantPermissions(): CaseVariantPermissions {
  const caseEntity = useContext(CaseEntityContext);
  const orgCode = caseEntity?.diagnosis_lab_code;

  return {
    canInterpret: useHasOrgAction(ORG_ACTIONS.interpretVariant, orgCode),
    canComment: useHasOrgAction(ORG_ACTIONS.commentVariant, orgCode),
    canFlag: useHasOrgAction(ORG_ACTIONS.flagVariant, orgCode),
  };
}
