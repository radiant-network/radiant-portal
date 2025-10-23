import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import GeneOverlapFullCNVIcon from '@/components/base/icons/gene-overlap-full-cnv-icon';
import GeneOverlapFullGeneIcon from '@/components/base/icons/gene-overlap-full-gene-icon';
import GeneOverlapPartialIcon from '@/components/base/icons/gene-overlap-partial-icon';

type OverlapTypeGeneCellProps = {
  type?: string;
};

/**
 * type1 = full_gene
 * type2 = partial
 * type3 = full_cnv
 */
function OverlapTypeGeneCell({ type }: OverlapTypeGeneCellProps) {
  if (!type) return <EmptyCell />;

  if (type == 'full_gene') {
    return <GeneOverlapFullGeneIcon size={24} />;
  }

  if (type == 'partial') {
    return <GeneOverlapPartialIcon size={24} />;
  }

  return <GeneOverlapFullCNVIcon size={24} />;
}
export default OverlapTypeGeneCell;
