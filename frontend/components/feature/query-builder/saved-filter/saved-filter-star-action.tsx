import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { StarIcon } from 'lucide-react';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import { SavedFilterTypeEnum } from '@/components/model/saved-filter';
import { Button } from '@/components/base/ui/button';

function SavedFiltersStarAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder, enableFavorite } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  if (!enableFavorite) {
    return null;
  }

  const handleStar = function () {
    if (selectedSavedFilter) {
      selectedSavedFilter.save(SavedFilterTypeEnum.Filter, {
        favorite: !selectedSavedFilter.isFavorite(),
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
