import { Badge } from '@/components/base/ui/badge';

import RelationshipToProbandField from '../../information/relationship-to-proband-field';

type RelationshipToProbandCellProps = {
  children?: React.ReactElement;
  relationship?: string;
};
function RelationshipToProbandCell({ children, relationship }: RelationshipToProbandCellProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
      {relationship && (
        <Badge className="capitalize" variant="outline">
          <RelationshipToProbandField relationship={relationship} />
        </Badge>
      )}
    </div>
  );
}

export default RelationshipToProbandCell;
