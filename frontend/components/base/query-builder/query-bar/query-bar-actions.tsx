import { useQueryBuilderContext } from '../query-builder-context';

import QueryBarDeleteAction from './query-bar-delete-action';
import QueryBarDuplicateAction from './query-bar-duplicate-action';
import QueryBarSaveAction from './query-bar-save-action';

/**
 * [+] [💾] [⧉] [🗑] [share]    [ 📁 My Filters ▾ ]
 */
function QueryBarActions() {
  const { customPillConfig } = useQueryBuilderContext();

  return (
    <div
      className="
      flex items-center p-2 border-r border-t border-b 
      border-muted-foreground/20 bg-muted/35 text-muted-foreground
      group-data-[query-active=true]/query:border-primary/75
      group-data-[query-active=true]/query:bg-primary/10
      group-data-[query-active=true]/query:text-foreground"
      onClick={e => e.stopPropagation()}
    >
      {customPillConfig?.enable && <QueryBarSaveAction />}
      <QueryBarDuplicateAction />
      <QueryBarDeleteAction />
    </div>
  );
}

export default QueryBarActions;
