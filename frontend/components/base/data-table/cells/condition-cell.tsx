import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { getObolibraryUrl } from '@/components/lib/external-links';

interface ConditionCellProps {
  conditionId?: string;
  conditionName?: string;
}

/**
 * e.g. Abnormal Delivery (HP:12345)
 */
function ConditionCell({ conditionId, conditionName }: ConditionCellProps) {
  if (!conditionId || !conditionName) {
    return <EmptyCell />;
  }

  return (
    <div className="font-medium">
      <a href={getObolibraryUrl(conditionId)} target="_blank" className="hover:underline" rel="noreferrer">
        {conditionName}
      </a>{' '}
      <span className="font-mono text-xs text-muted-foreground">
        (
        <a href={getObolibraryUrl(conditionId)} target="_blank" className="hover:underline" rel="noreferrer">
          {conditionId}
        </a>
        )
      </span>
    </div>
  );
}

export default ConditionCell;
