import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PropsWithChildren } from "react";

type InformationFieldProps = {
  label: string;
  labelTooltipsText?: string;
  tooltipsText?: string;
};

function InformationField({ label, labelTooltipsText, children, tooltipsText }: PropsWithChildren<InformationFieldProps>) {
  const labelContent = (!labelTooltipsText) ?
    label !== undefined ? label : '-'
    : (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted underline-offset-4 cursor-help">
            {label !== undefined ? label : '-'}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {labelTooltipsText}
        </TooltipContent>
      </Tooltip>
    );

  const content = (!tooltipsText) ?
    children !== undefined ? children : '-'
    : (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            {children !== undefined ? children : '-'}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipsText}
        </TooltipContent>
      </Tooltip>
    );

  return (
    <div className="inline-flex gap-2 justify-between text-sm">
      <span className="text-muted-foreground flex-1">{labelContent}</span>
      <span className="flex-1">{content}</span>
    </div>
  );
};
export default InformationField;