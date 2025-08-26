import ClassificationBadge from '@/components/base/badges/classification-badge';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type ClinvarCellProps = {
  codes?: string[];
};

function ClassificationCell({ codes = [] }: ClinvarCellProps) {
  if (codes.filter(code => code != '' && code != null).length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {codes.map(code => (
        <ClassificationBadge key={code} value={code} abbreviated />
      ))}
    </div>
  );
}

export default ClassificationCell;
