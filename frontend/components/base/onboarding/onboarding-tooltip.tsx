import type { TooltipRenderProps } from 'react-joyride';

import { Button } from '@/components/base/shadcn/button';

function OnboardingTooltip({
  backProps,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  const { buttons, content, title } = step;
  const { title: backLabel, ...backRest } = backProps;
  const { title: skipLabel, ...skipRest } = skipProps;
  const { title: primaryLabel, ...primaryRest } = primaryProps;

  return (
    <div
      {...tooltipProps}
      className="w-96 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
    >
      {title && <h4 className="mb-2 text-sm font-semibold">{title}</h4>}
      <div className="text-sm text-muted-foreground">{content}</div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {buttons.includes('skip') && !isLastStep && (
          <Button variant="ghost" size="xs" className="mr-auto" {...skipRest}>
            {skipLabel}
          </Button>
        )}
        {buttons.includes('back') && index > 0 && (
          <Button variant="outline" size="xs" {...backRest}>
            {backLabel}
          </Button>
        )}
        {buttons.includes('primary') && (
          <Button size="xs" {...primaryRest}>
            {primaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default OnboardingTooltip;
