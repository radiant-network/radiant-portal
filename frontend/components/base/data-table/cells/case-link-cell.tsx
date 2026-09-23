import type { ReactNode } from 'react';

import { useTenantPath } from '@/components/hooks/use-tenant';

import AnchorLinkCell from './anchor-link-cell';

/** Links to a case entity in the active tenant. */
function CaseLinkCell({ caseId, children }: { caseId: number; children: ReactNode }) {
  const tenantPath = useTenantPath();

  return <AnchorLinkCell href={tenantPath(`/case/entity/${caseId}`)}>{children}</AnchorLinkCell>;
}

export default CaseLinkCell;
