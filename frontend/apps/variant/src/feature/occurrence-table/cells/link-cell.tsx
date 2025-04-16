import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { cn } from '@/components/lib/utils';

type LinkCellProps = {
  className?: string;
  url: string;
  children?: any;
};

function LinkCell({ className, url, children }: LinkCellProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={url} className={cn('overflow-hidden text-ellipsis underline hover:no-underline', className)}>
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export default LinkCell;
