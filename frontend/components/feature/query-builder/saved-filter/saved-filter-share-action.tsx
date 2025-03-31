import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { Share2Icon } from 'lucide-react';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import { Button } from '@/components/base/ui/button';

function SavedFiltersShareAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleShare = function () {
    // Share
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={selectedSavedFilter?.isDirty() || selectedSavedFilter?.isNew() || !selectedSavedFilter}
            onClick={handleShare}
          >
            <Share2Icon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {selectedSavedFilter?.isDirty() || !selectedSavedFilter
          ? dict.savedFilter.shareTooltip.whenNotSaved
          : dict.savedFilter.shareTooltip.default}
      </TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersShareAction;
