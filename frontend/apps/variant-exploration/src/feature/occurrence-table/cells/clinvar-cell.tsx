import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';

type ClinvarCellProps = {
  codes?: string[];
};

function ClinvarCell({ codes = [] }: ClinvarCellProps) {
  if (codes.length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {codes.map(code => {
        return <ClinVarBadge value={code} abbreviated />;
      })}
    </div>
  );
}

export default ClinvarCell;
