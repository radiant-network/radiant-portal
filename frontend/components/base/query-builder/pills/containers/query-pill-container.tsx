import { XIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

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
  const { t } = useI18n();

  return (
    <div
      data-cy="query-pill"
      className="flex items-center rounded-xs p-0.5 bg-muted group-data-[query-active=true]/query:bg-primary/25"
    >
      {children}

      <Button
        data-cy="query-pill-remove"
        iconOnly
        variant="ghost"
        size="sm"
        className="mr-0.5 ml-1 py-0.5 enabled:hover:bg-transparent size-4"
        aria-label={t('a11y.query_pill.remove')}
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
