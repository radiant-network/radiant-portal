import { XIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';

type QueryPillContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemovePill: () => void;
};

/**
 * Simple wrapper that:
 * - Add the blue background to highlight the query pill if it has been selected by the user
 * - Add the X button to remove query-pill
 *
 *          ┌────────────────────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *          └────────────────────────────┘
 */
function QueryPillContainer({ children, onRemovePill }: QueryPillContainerProps) {
  return (
    <div className="flex items-center rounded-xs p-0.5 bg-muted group-data-[query-active=true]/query:bg-primary/25">
      {children}

      <Button
        iconOnly
        variant="ghost"
        size="sm"
        className="mr-0.5 ml-1 py-0.5 enabled:hover:bg-transparent size-4"
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
