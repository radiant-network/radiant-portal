import EmptyCell from '@/components/base/data-table/cells/empty-cell';

interface RelationTableCell {
  relationshipToProband?: string;
}

function RelationTableCell({ relationshipToProband }: RelationTableCell) {
  if (!relationshipToProband) {
    return <EmptyCell />;
  }

  return <span>{relationshipToProband.charAt(0).toUpperCase() + relationshipToProband.slice(1)}</span>;
}

export default RelationTableCell;
