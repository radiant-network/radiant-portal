import type { ReactNode } from 'react';

import { useLocalPath } from '@/components/hooks/use-local-path';

import AnchorLinkCell from './anchor-link-cell';

/** Links to a case entity in the active tenant. */
function CaseLinkCell({ caseId, children }: { caseId: number; children: ReactNode }) {
  const localPath = useLocalPath();

  return <AnchorLinkCell href={localPath(`/case/entity/${caseId}`)}>{children}</AnchorLinkCell>;
}

export default CaseLinkCell;
