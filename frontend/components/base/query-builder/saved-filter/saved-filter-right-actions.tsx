import { cn } from '@/components/lib/utils';

import SavedFiltersDeleteAction from './saved-filter-delete-action';
import SavedFiltersDuplicateAction from './saved-filter-duplicate-action';
import SavedFiltersNewAction from './saved-filter-new-action';
import SavedFiltersSaveAction from './saved-filter-save-action';
import SavedFiltersSelect from './saved-filter-select';
import SavedFiltersShareAction from './saved-filter-share-action';

function SavedFiltersRightActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex', className)} {...props}>
      <div className="flex gap-4 items-center" onClick={e => e.stopPropagation()}>
        <div className="flex whitespace-nowrap">
          <SavedFiltersNewAction />
          <SavedFiltersSaveAction />
          <SavedFiltersDuplicateAction />
          <SavedFiltersDeleteAction />
          <SavedFiltersShareAction />
        </div>
        <SavedFiltersSelect />
      </div>
    </div>
  );
}

export default SavedFiltersRightActions;
