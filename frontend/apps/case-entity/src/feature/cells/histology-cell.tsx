
import { Badge } from "@/components/base/ui/badge";

type HistologyCellProps = {
  code: string;
}
function HistologyCell({ code }: HistologyCellProps) {
  return (<Badge className="capitalize" variant="secondary">{code}</Badge>);
}

export default HistologyCell;
