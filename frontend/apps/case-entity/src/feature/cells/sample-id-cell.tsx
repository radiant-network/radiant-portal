import { Badge } from "@/components/base/ui/badge";

type SampleIdCellProps = {
  id: number;
  relationship?: string;
}
function SampleIdCell({ id, relationship }: SampleIdCellProps) {
  return (
    <span className="inline-flex gap-2">
      {id} {relationship && <Badge className="capitalize" variant="outline">{relationship}</Badge>}
    </span>
  );
}

export default SampleIdCell;
