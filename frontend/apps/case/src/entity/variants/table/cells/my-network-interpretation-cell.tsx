import ClassificationBadge from '@/components/base/badges/classification-badge';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type MyNetworkInterpretationCellProps = {
  counts?: { [key: string]: number };
};

function MyNetworkInterpretationCell({ counts }: MyNetworkInterpretationCellProps) {
  const classifications = Object.keys(counts ?? {});
  if (classifications.length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {classifications.map(classification => (
        <ClassificationBadge key={classification} value={classification} abbreviated />
      ))}
    </div>
  );
}

export default MyNetworkInterpretationCell;
