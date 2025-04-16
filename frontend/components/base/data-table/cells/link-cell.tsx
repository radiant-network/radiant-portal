import { Link } from 'react-router';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/ui/tooltip';
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
        <Link to={url} className={cn('overflow-hidden text-ellipsis underline hover:no-underline', className)}>
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export default LinkCell;
