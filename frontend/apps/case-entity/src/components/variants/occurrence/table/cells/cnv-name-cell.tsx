import { GermlineCNVOccurrence } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type CNVNameCellProps = {
  occurrence: GermlineCNVOccurrence;
};

/**
 * @TODO: genome_build will be added later in API
 *
 * IF genome_build == GRCh38 THEN
 * IF type == “GAIN” THEN
 * href = https://franklin.genoox.com/clinical-db/variant/sv/chr`chromosome`-`start`-`end`-DUP-HG38
 * ENDIF
 * IF type == “LOSS” THEN
 * href =  https://franklin.genoox.com/clinical-db/variant/sv/chr`chromosome`-`start`-`end`-DEL-HG38
 */
function CNVNameCell({ occurrence }: CNVNameCellProps) {
  const { start, type, end, chromosome, name } = occurrence;
  if (name == undefined) return <EmptyCell />;

  const hrefType = type === 'GAIN' ? 'DUP' : 'DEL';
  const href = `https://franklin.genoox.com/clinical-db/variant/sv/chr${chromosome}-${start}-${end}-${hrefType}-HG38`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AnchorLink size="sm" href={href} target="_blank">
          {name}
        </AnchorLink>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

export default CNVNameCell;
