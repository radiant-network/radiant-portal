import ClassificationBadge from '@/components/base/badges/classification-badge';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type ClinvarCellProps = {
  codes?: string[];
};

/*
 * @TODO: When api send clinvar_id, a link to the ncbi website should be created to redirect on click
 * ClinVar website using clinvar_id
 * e.g: https://www.ncbi.nlm.nih.gov/clinvar/variation/128882/
 */
function ClinvarCell({ codes = [] }: ClinvarCellProps) {
  if (codes === null || codes.filter(code => code != '' && code != null).length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {codes.map(code => (
        <ClassificationBadge key={code} value={code} abbreviated />
      ))}
    </div>
  );
}

export default ClinvarCell;
