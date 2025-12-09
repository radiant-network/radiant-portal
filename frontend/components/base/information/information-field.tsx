import { PropsWithChildren } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import EmptyField from './empty-field';

type InformationFieldProps = {
  label: string;
  labelTooltipText?: string;
  tooltipText?: string;
};

function InformationField({
  label,
  labelTooltipText,
  children,
  tooltipText,
}: PropsWithChildren<InformationFieldProps>) {
  const labelOrPlaceholder = label !== undefined ? label : <EmptyField />;
  const labelContent = !labelTooltipText ? (
    labelOrPlaceholder
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted underline-offset-4 cursor-pointer">{labelOrPlaceholder}</span>
      </TooltipTrigger>
      <TooltipContent>{labelTooltipText}</TooltipContent>
    </Tooltip>
  );

  const contentOrPlaceholder = children !== undefined ? children : <EmptyField />;
  const content = !tooltipText ? (
    contentOrPlaceholder
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-pointer">{contentOrPlaceholder}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
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
