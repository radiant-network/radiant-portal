import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import CanonicalBadge from '@/components/base/variant/canonical-badge';
import ManePlusBadge from '@/components/base/variant/mane-plus-badge';
import ManeSelectBadge from '@/components/base/variant/mane-select-badge';

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
      key: 'canonical',
    },
    {
      condition: isManeSelect,
      icon: <ManeSelectBadge />,
      key: 'mane-select',
    },
    {
      condition: isManePlus,
      icon: <ManePlusBadge />,
      key: 'mane-plus',
    },
  ];

  return (
    <div className="inline-flex items-center gap-1">
      {pills
        .filter(({ condition }) => condition)
        .map(({ icon, key }) => (
          <span key={key}>{icon}</span>
        ))}
    </div>
  );
}

export default ManeCell;
