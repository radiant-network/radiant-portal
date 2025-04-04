import { useQueryBarContext } from './query-bar-context';
import { Checkbox } from '@/components/base/ui/checkbox';

function QueryBarSelector() {
  const { query } = useQueryBarContext();

  if (query.isSelectable()) {
    return (
      <div
        className="
      flex gap-2 items-center py-2 px-4 border-l border-t border-b 
      border-muted-foreground/20 bg-muted/35 text-muted-foreground
      group-data-[query-active=true]/query:border-primary/75
      group-data-[query-active=true]/query:bg-primary/10
      group-data-[query-active=true]/query:text-foreground
      "
      >
        <Checkbox
          size="sm"
          checked={query.isSelected()}
          onClick={e => {
            e.stopPropagation();
            query.toggleSelect(!query.isSelected());
          }}
        />
        <span className="text-xs font-medium">Q{query.index() + 1}</span>
      </div>
    );
  }

  return null;
}

export default QueryBarSelector;
