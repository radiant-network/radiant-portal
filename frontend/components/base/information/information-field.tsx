import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { PropsWithChildren } from 'react';
import EmptyField from './empty-field';

type InformationFieldProps = {
  label: string;
  labelTooltipsText?: string;
  tooltipsText?: string;
};

function InformationField({
  label,
  labelTooltipsText,
  children,
  tooltipsText,
}: PropsWithChildren<InformationFieldProps>) {
  const labelOrPlaceholder = label !== undefined ? label : <EmptyField />;
  const labelContent = !labelTooltipsText ? (
    labelOrPlaceholder
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted underline-offset-4 cursor-pointer">
          {labelOrPlaceholder}
        </span>
      </TooltipTrigger>
      <TooltipContent>{labelTooltipsText}</TooltipContent>
    </Tooltip>
  );

  const contentOrPlaceholder = children !== undefined ? children : <EmptyField />;
  const content = !tooltipsText ? (
    contentOrPlaceholder
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer">{contentOrPlaceholder}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltipsText}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="inline-flex gap-2 justify-between text-sm">
      <span className="text-muted-foreground flex-1">{labelContent}</span>
      <span className="flex-1">{content}</span>
    </div>
  );
}
export default InformationField;
