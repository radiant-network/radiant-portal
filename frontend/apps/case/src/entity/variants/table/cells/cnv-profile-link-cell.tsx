import type { GermlineCNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { useCNVProfile } from '../../germline-occurrence/cnv-profile/cnv-profile-context';
import { cnvFocus } from '../../germline-occurrence/cnv-profile/libs/focus';
import type { FetchCNVGenesOverlap } from '../../modals/overlapping-gene-dialog';

import OverlappingGeneLinkCell from './overlapping-gene-link-cell';

type CNVProfileLinkCellProps = {
  occurrence: GermlineCNVOccurrence;
  fetchGenesOverlap: FetchCNVGenesOverlap;
  values?: string[];
};

function CNVProfileLinkCell({ occurrence, fetchGenesOverlap, values }: CNVProfileLinkCellProps) {
  const { available, open } = useCNVProfile();
  const label = values?.join(', ');

  if (!available || !label)
    return (
      <OverlappingGeneLinkCell occurrence={occurrence} fetchGenesOverlap={fetchGenesOverlap}>
        {label ? <>{label}</> : undefined}
      </OverlappingGeneLinkCell>
    );
  return (
    <AnchorLink component="button" type="button" size="sm" onClick={() => open(cnvFocus(occurrence))}>
      {label}
    </AnchorLink>
  );
}

export default CNVProfileLinkCell;
