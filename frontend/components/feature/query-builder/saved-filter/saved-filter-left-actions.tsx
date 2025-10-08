import React from 'react';

import { cn } from '@/components/lib/utils';

import { useQueryBuilderContext } from '../query-builder-context';

import SavedFiltersEditAction from './saved-filter-edit-action';
import SavedFiltersStarAction from './saved-filter-star-action';
import SavedFiltersUndoAction from './saved-filter-undo-action';

function SavedFiltersLeftActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <div
      className={cn('flex items-center gap-4 whitespace-nowrap text-ellipsis overflow-hidden', className)}
      {...props}
    >
      <div className="text-ellipsis overflow-hidden text-base">
        {selectedSavedFilter?.raw().name ?? queryBuilder.coreProps.savedFilterDefaultTitle}
      </div>
      <div className="flex items-center" onClick={e => e.stopPropagation()}>
        <SavedFiltersEditAction />
        <SavedFiltersStarAction />
        <SavedFiltersUndoAction />
      </div>
    </div>
  );
}

export default SavedFiltersLeftActions;
