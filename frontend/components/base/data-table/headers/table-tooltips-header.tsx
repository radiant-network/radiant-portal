import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { cn } from '@/components/lib/utils';

type TooltipsHeaderProps = {
  tooltips?: any;
  children?: any;
  iconOnly?: boolean;
};

/**
 * An empty content with no-break space unicode is used to applied an underline style
 */
function TooltipsHeader({ tooltips, children, iconOnly = false }: TooltipsHeaderProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn('underline decoration-dotted underline-offset-4', {
          relative: iconOnly,
        })}
      >
        {children}
        {iconOnly && (
          <span className="absolute inset-0 -z-10 after:content-['\00a0\00a0\00a0'] after:absolute after:inset-0 after:underline after:decoration-dotted after:underline-offset-4" />
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltips}</TooltipContent>
    </Tooltip>
  );
}

export default TooltipsHeader;
