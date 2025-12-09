import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import Rating, { RatingProps } from '../../rating';

type RatingCellProps = RatingProps & {
  tooltip?: string;
};
function RatingCell({ tooltip, ...props }: RatingCellProps) {
  if (!tooltip) return <Rating {...props} />;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Rating {...props} />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
export default RatingCell;
