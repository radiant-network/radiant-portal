import type { GermlineCNVOccurrence } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { getFranklinCnvUrl } from '@/components/base/variant/utils';

import { useCNVProfile } from '../../cnv-profile/cnv-profile-dialog';
import { cnvFocus } from '../../cnv-profile/libs/focus';

type CNVNameCellProps = {
  occurrence: GermlineCNVOccurrence;
};

/**
 * Opens the CNV profile on the CNV, whose panel links to Franklin. Without a profile, links to
 * Franklin directly.
 */
function CNVNameCell({ occurrence }: CNVNameCellProps) {
  const { available, open } = useCNVProfile();
  const { start, type, end, chromosome, name } = occurrence;
  if (name == undefined) return <EmptyCell />;

  const link = available ? (
    <AnchorLink component="button" type="button" size="sm" onClick={() => open(cnvFocus(occurrence))}>
      {name}
    </AnchorLink>
  ) : (
    <AnchorLink size="sm" href={getFranklinCnvUrl(chromosome, start, end, type)} target="_blank">
      {name}
    </AnchorLink>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

export default CNVNameCell;
