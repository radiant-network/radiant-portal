import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Badge } from '@/components/base/ui/badge';

type ClinvarCellProps = {
  codes?: string[];
};

function ClinvarCell({ codes = [] }: ClinvarCellProps) {
  if (codes.length === 0) return <EmptyCell />;

  return (
    <>
      {codes.map(code => {
        return (
          <Badge key={code} className="me-2">
            {code}
          </Badge>
        );
      })}
    </>
  );
}

export default ClinvarCell;
