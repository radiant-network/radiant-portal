import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/ui/tooltip';

type TooltipsHeaderProps = {
  tooltips?: any;
  children?: any;
};

function TooltipsHeader({ tooltips, children }: TooltipsHeaderProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{tooltips}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipsHeader;
