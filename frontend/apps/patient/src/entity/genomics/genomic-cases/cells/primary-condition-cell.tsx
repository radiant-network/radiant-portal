import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type PrimaryConditionCellProps = {
  mondoId?: string;
  name?: string;
};

function PrimaryConditionCell({ mondoId, name }: PrimaryConditionCellProps) {
  if (!name && !mondoId) return <EmptyCell />;

  const code = mondoId?.replace(/^MONDO:/i, '');
  const label = mondoId ? `${name ?? ''} (${mondoId})`.trim() : (name ?? '');

  if (!code) return <span className="text-xs">{label}</span>;

  return (
    <AnchorLinkCell href={`http://purl.obolibrary.org/obo/MONDO_${code}`} target="_blank" rel="noreferrer">
      {label}
    </AnchorLinkCell>
  );
}

export default PrimaryConditionCell;
