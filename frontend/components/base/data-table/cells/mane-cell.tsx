import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import ManePlusBadge from '@/components/feature/variant/mane-plus-badge';
import ManeSelectBadge from '@/components/feature/variant/mane-select-badge';
import CanonicalBadge from '@/components/feature/variant/canonical-badge';

type ManeCellProps = {
  isCanonical?: boolean;
  isManeSelect?: boolean;
  isManePlus?: boolean;
};

function ManeCell({ isCanonical, isManeSelect, isManePlus }: ManeCellProps) {
  if (!isCanonical && !isManeSelect && !isManePlus) return <EmptyCell />;

  const pills = [
    {
      condition: isCanonical,
      icon: <CanonicalBadge />,
    },
    {
      condition: isManeSelect,
      icon: <ManeSelectBadge />,
    },
    {
      condition: isManePlus,
      icon: <ManePlusBadge />,
    },
  ];

  return (
    <div className="inline-flex items-center gap-1">
      {pills
        .filter(({ condition }) => condition)
        .map(({ icon }) => (icon))}
    </div>
  );
}

export default ManeCell;
