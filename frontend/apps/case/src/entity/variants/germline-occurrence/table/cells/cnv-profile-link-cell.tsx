import type { GermlineCNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { useCNVProfile } from '../../cnv-profile/cnv-profile-context';
import { cnvFocus } from '../../cnv-profile/libs/focus';

import OverlappingGeneLinkCell from './overlapping-gene-link-cell';

type CNVProfileLinkCellProps = {
  occurrence: GermlineCNVOccurrence;
  values?: string[];
};

function CNVProfileLinkCell({ occurrence, values }: CNVProfileLinkCellProps) {
  const { available, open } = useCNVProfile();
  const label = values?.join(', ');

  if (!available || !label)
    return (
      <OverlappingGeneLinkCell occurrence={occurrence}>{label ? <>{label}</> : undefined}</OverlappingGeneLinkCell>
    );
  return (
    <AnchorLink component="button" type="button" size="sm" onClick={() => open(cnvFocus(occurrence))}>
      {label}
    </AnchorLink>
  );
}

export default CNVProfileLinkCell;
