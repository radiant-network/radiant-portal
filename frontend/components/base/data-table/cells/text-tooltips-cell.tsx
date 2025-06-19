import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type TextTooltipsCell = {
  children: any;
  tooltipsText: string;
  asChild?: boolean;
};

function TextTooltipsCell({ children, tooltipsText, asChild = false }: TextTooltipsCell) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{tooltipsText}</TooltipContent>
    </Tooltip>
  );
}

export default TextTooltipsCell;
