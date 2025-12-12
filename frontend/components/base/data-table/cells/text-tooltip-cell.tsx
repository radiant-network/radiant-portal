import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import EmptyCell from './empty-cell';

type TextTooltipCell = {
  children: any;
  tooltipText?: string;
  asChild?: boolean;
};

function TextTooltipCell({ children, tooltipText, asChild = false }: TextTooltipCell) {
  if (!children) return <EmptyCell />;

  if (!tooltipText) return <span>{children}</span>;

  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}

export default TextTooltipCell;
