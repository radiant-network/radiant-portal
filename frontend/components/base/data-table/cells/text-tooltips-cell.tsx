import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import EmptyCell from './empty-cell';

type TextTooltipsCell = {
  children: any;
  tooltipsText?: string;
  asChild?: boolean;
};

function TextTooltipsCell({ children, tooltipsText, asChild = false }: TextTooltipsCell) {

  if (!children) return <EmptyCell />;

  if (!tooltipsText) return <span>{children}</span>;

  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{tooltipsText}</TooltipContent>
    </Tooltip>
  );
}

export default TextTooltipsCell;
