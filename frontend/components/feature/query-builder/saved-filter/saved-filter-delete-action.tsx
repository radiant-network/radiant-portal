import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { TrashIcon } from 'lucide-react';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import { openDeleteSavedFilterAlert } from '../alerts';
import { Button } from '@/components/base/ui/button';

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
