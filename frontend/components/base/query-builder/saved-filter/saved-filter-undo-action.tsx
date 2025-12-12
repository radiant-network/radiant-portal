import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function SavedFiltersUndoAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  if (!selectedSavedFilter?.isDirty()) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          iconOnly
          variant="ghost"
          size="sm"
          disabled={!selectedSavedFilter}
          onClick={() => selectedSavedFilter.discardChanges()}
        >
          <RotateCcw />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{dict.savedFilter.discardTooltip}</TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersUndoAction;
