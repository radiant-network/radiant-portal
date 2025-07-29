import Rating, { RatingProps } from "../../rating";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

type RatingCellProps = RatingProps & {
  tooltips?: string;
};
function RatingCell({ tooltips, ...props }: RatingCellProps) {
  if (!tooltips) return <Rating {...props} />;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Rating {...props} />
      </TooltipTrigger>
      <TooltipContent>{tooltips}</TooltipContent>
    </Tooltip>
  );
};
export default RatingCell;
