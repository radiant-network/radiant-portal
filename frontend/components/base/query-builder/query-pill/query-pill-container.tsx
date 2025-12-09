import { XIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { cn } from '@/components/lib/utils';

export type QueryPillContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemovePill: () => void;
};

/**
 * Simple wrapper that X remove button
 *
 * e.g.
 * In the UI, QueryPillContainer manage [ [....][X] ]
 * | ┌──────────────────────────────────────────┐ |
 * | | Loremp Ipsum = [1,2, 3 >][X]      | 389K | |
 * | └──────────────────────────────────────────┘ |
 *
 */
function QueryPillContainer({ children, className, onRemovePill, ...props }: QueryPillContainerProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-xs p-[2px] bg-muted group-data-[query-active=true]/query:bg-primary/25',
        className,
      )}
      {...props}
    >
      {children}
      <Button
        iconOnly
        variant="ghost"
        size="sm"
        className="mr-[2px] ml-[4px] py-[2px] enabled:hover:bg-transparent size-4"
        onClick={e => {
          e.stopPropagation();
          onRemovePill();
        }}
      >
        <XIcon />
      </Button>
    </div>
  );
}

export default QueryPillContainer;
