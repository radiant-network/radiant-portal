
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

interface ConditionCellProps {
  conditionId?: string;
  conditionName?: string;
}

function ConditionCell({ conditionId, conditionName }: ConditionCellProps) {
  if (!conditionId || !conditionName) {
    return <EmptyCell />;
  }

  return (
    <div className="font-medium">
      <a
        href={`http://purl.obolibrary.org/obo/${conditionId?.replace(':', '_')}`}
        target="_blank"
        className="hover:underline"
      >
        {conditionName}
      </a>{' '}
      <span className="font-mono text-xs text-muted-foreground">
        (
        <a
          href={`http://purl.obolibrary.org/obo/${conditionId?.replace(':', '_')}`}
          target="_blank"
          className="hover:underline"
        >
          {conditionId}
        </a>
        )
      </span>
    </div>
  );
}

export default ConditionCell;
