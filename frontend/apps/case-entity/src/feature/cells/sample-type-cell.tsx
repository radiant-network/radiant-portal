
import { Badge } from "@/components/base/ui/badge";

type SampleTypeCellProps = {
  type: string;
}
function SampleTypeCell({ type }: SampleTypeCellProps) {
  return (<Badge className="uppercase" variant="secondary">{type}</Badge>);
}

export default SampleTypeCell;
