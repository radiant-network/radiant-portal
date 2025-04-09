import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type TooltipsHeaderProps = {
  tooltips?: any;
  children?: any;
};

function TooltipsHeader({ tooltips, children }: TooltipsHeaderProps) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{tooltips}</TooltipContent>
    </Tooltip>
  );
}

export default TooltipsHeader;
