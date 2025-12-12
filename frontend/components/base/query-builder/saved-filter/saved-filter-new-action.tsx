import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { openOverwriteSavedFilterAlert } from '../alerts';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function SavedFiltersNewAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleNew = function () {
    if (selectedSavedFilter?.isDirty()) {
      openOverwriteSavedFilterAlert(queryBuilder, dict);
    } else {
      queryBuilder.createSavedFilter();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            onClick={handleNew}
            disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
          >
            <PlusIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{dict.savedFilter.newFilter}</TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersNewAction;
