import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { SavedFilterTypeEnum } from '@/components/cores/saved-filter';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function SavedFiltersStarAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder, enableFavorite } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  if (!enableFavorite) {
    return null;
  }

  const handleStar = function () {
    if (selectedSavedFilter) {
      selectedSavedFilter
        .save(SavedFilterTypeEnum.Filter, {
          favorite: !selectedSavedFilter.isFavorite(),
        })
        .then(() => {
          toast.success(dict.savedFilter.notifications.updated);
        })
        .catch(() => {
          toast.error(dict.savedFilter.notifications.errors.updated);
        });
    } else {
      queryBuilder.saveNewFilter({ favorite: true });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button iconOnly variant="ghost" size="sm" disabled={!selectedSavedFilter} onClick={handleStar}>
          <StarIcon className={selectedSavedFilter?.isFavorite() ? 'stroke-yellow-500 fill-yellow-500' : ''} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {selectedSavedFilter?.isFavorite()
          ? dict.savedFilter.favoriteTooltip.unset
          : dict.savedFilter.favoriteTooltip.set}
      </TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersStarAction;
