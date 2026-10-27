import type { GermlineCNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { useCNVProfile } from '../../cnv-profile/cnv-profile-context';
import type { CNVProfileFocus } from '../../cnv-profile/libs/focus';

import OverlappingGeneLinkCell from './overlapping-gene-link-cell';

type CNVProfileLinkCellProps = {
  occurrence: GermlineCNVOccurrence;
  focus: CNVProfileFocus;
  label?: string;
};

/**
 * Opens the CNV profile on a CNV or a gene. Without a profile, opens the overlapping genes of the CNV.
 */
function CNVProfileLinkCell({ occurrence, focus, label }: CNVProfileLinkCellProps) {
  const { available, open } = useCNVProfile();

  if (!available || !label)
    return (
      <OverlappingGeneLinkCell occurrence={occurrence}>{label ? <>{label}</> : undefined}</OverlappingGeneLinkCell>
    );
  return (
    <AnchorLink component="button" type="button" size="sm" onClick={() => open(focus)}>
      {label}
    </AnchorLink>
  );
}

export default CNVProfileLinkCell;
