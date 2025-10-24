import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import GeneOverlapFullCNVIcon from '@/components/base/icons/gene-overlap-full-cnv-icon';
import GeneOverlapFullGeneIcon from '@/components/base/icons/gene-overlap-full-gene-icon';
import GeneOverlapPartialIcon from '@/components/base/icons/gene-overlap-partial-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type OverlapTypeGeneCellProps = {
  type?: string;
};

/**
 * type1 = full_gene
 * type2 = partial
 * type3 = full_cnv
 */
function OverlapTypeGeneCell({ type }: OverlapTypeGeneCellProps) {
  const { t } = useI18n();

  if (!type) return <EmptyCell />;

  let icon = <GeneOverlapFullCNVIcon size={24} />;

  if (type == 'full_gene') {
    icon = <GeneOverlapFullGeneIcon size={24} />;
  }

  if (type == 'partial') {
    icon = <GeneOverlapPartialIcon size={24} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger>{icon}</TooltipTrigger>
      <TooltipContent>{t(`case_entity.variants.filters.cnv_type.${type}`)}</TooltipContent>
    </Tooltip>
  );
}
export default OverlapTypeGeneCell;
