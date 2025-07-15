
import { Badge } from "@/components/base/ui/badge";

type ExperimentalStrategyCellProps = {
  code: string;
}
function ExperimentalStrategyCell({ code }: ExperimentalStrategyCellProps) {
  return (<Badge className="uppercase" variant="secondary">{code}</Badge>);
}

export default ExperimentalStrategyCell;
