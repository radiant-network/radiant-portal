import { Badge, BadgeProps } from "../../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

type BadgeTooltipsProps = BadgeProps & {
  tooltip: string;
};
function BadgeCell({ children, tooltip, ...props }: BadgeTooltipsProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge {...props}>{children}</Badge>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};
export default BadgeCell;
