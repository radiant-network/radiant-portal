import { TrashIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { openDeleteSavedFilterAlert } from '../alerts';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function SavedFiltersDeleteAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
            onClick={() => openDeleteSavedFilterAlert(selectedSavedFilter!, dict)}
          >
            <TrashIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{dict.savedFilter.deleteTooltip}</TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersDeleteAction;
