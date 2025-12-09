import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { cn } from '@/components/lib/utils';

type TooltipHeaderProps = {
  tooltip?: any;
  children?: any;
  iconOnly?: boolean;
};

/**
 * An empty content with no-break space unicode is used to applied an underline style
 */
function TooltipHeader({ tooltip, children, iconOnly = false }: TooltipHeaderProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        className={cn('underline truncate decoration-dotted underline-offset-4 text-left', {
          relative: iconOnly,
        })}
      >
        <span>
          {children}
          {iconOnly && (
            <span className="absolute inset-0 -z-10 after:content-['\00a0\00a0\00a0'] after:absolute after:inset-0 after:underline after:decoration-dotted after:underline-offset-4" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default TooltipHeader;
