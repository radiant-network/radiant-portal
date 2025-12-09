import { Badge, BadgeProps } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import EmptyCell from './empty-cell';

type BadgeCellProps = BadgeProps & {
  tooltip?: string;
};
function BadgeCell({ children, tooltip, ...props }: BadgeCellProps) {
  if (!children) return <EmptyCell />;

  if (!tooltip) return <Badge {...props}>{children}</Badge>;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge {...props}>{children}</Badge>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
export default BadgeCell;
