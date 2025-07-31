import { Badge } from "@/components/base/ui/badge";

type SampleIdCellProps = {
  children: React.ReactElement;
  relationship?: string;
}
function RelationshipToProbandCell({ children, relationship }: SampleIdCellProps) {
  return (
    <div className="flex items-center gap-2">
      {children} {relationship && <Badge className="capitalize" variant="outline">{relationship}</Badge>}
    </div>
  );
}

export default RelationshipToProbandCell;
