import { useCallback, useEffect, useState } from 'react';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

import { SavedFilter, SavedFilterCreationInput, SavedFilterUpdateInput, Sqon } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { savedFiltersApi } from '@/utils/api';

import { useQBContext } from '../hooks/use-query-builder';
import { deepSqonsEqual } from '../libs/sqon';
import { fetchSavedFilters } from '../query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

/**
 * Save button for query-builder savedfilter
 */
function SaveFilterButton() {
  const { t } = useI18n();
  const dispatch = useSavedFiltersDispatch();
  const { sqons } = useQBContext();
  const { savedFilterType, selectedSavedFilter } = useSavedFiltersContext();
  const [isPristine, setIsPristine] = useState(true);

  // Check if there are any filters applied (not empty)
  const hasFilters = sqons.some(sqon => sqon.content && sqon.content.length > 0);

  useEffect(() => {
    // compare current sqons with selectedSavedFilter sqons to set pristine state
    if (!selectedSavedFilter) {
      setIsPristine(true);
      return;
    }
    const isEqual = deepSqonsEqual(sqons, selectedSavedFilter.queries || []);
    setIsPristine(isEqual);
    dispatch({ type: SavedFiltersActionType.SET_HAS_CHANGES_NOT_SAVED, payload: !isEqual });
  }, [sqons, selectedSavedFilter]);

  const fetchFilters = useCallback(
    async (newSavedFilter: SavedFilter) => {
      await fetchSavedFilters(savedFilterType).then(response =>
        dispatch({
          type: SavedFiltersActionType.SAVE,
          payload: { savedFilters: response, selectedSavedFilter: newSavedFilter },
        }),
      );
    },
    [savedFilterType, dispatch],
  );

  const handleSave = async () => {
    if (!hasFilters) {
      return;
    }

    try {
      if (isPristine) {
        // Create a new saved filter with current sqons
        const newFilterData: SavedFilterCreationInput = {
          name: t('common.saved_filter.untitled_filter'),
          queries: sqons as Sqon[],
          type: savedFilterType,
        };

        const newSavedFilter = await savedFiltersApi.postSavedFilter(newFilterData);
        // Refresh saved filters list after creation
        await fetchFilters(newSavedFilter.data);

        toast.success(t('common.saved_filter.notifications.created'));
      }
      if (selectedSavedFilter && !isPristine) {
        // Update existing filter queries
        const updatedFilterData: SavedFilterUpdateInput = {
          ...selectedSavedFilter,
          queries: sqons as Sqon[],
        };
        const updatedSavedFilter = await savedFiltersApi.putSavedFilter(selectedSavedFilter.id, updatedFilterData);
        // Refresh saved filters list after update
        await fetchFilters(updatedSavedFilter.data);

        toast.success(t('common.saved_filter.notifications.updated'));
      }
    } catch (error: any) {
      if (error.response.data.detail.includes('unique_saved_filter')) {
        toast.error(t('common.saved_filter.notifications.errors.duplicated'));
        return;
      }
      if (isPristine) {
        toast.error(t('common.saved_filter.notifications.errors.created'));
        return;
      }
      toast.error(t('common.saved_filter.notifications.errors.updated'));
    }
  };

  const getTooltipContent = () => {
    if (!hasFilters) {
      return t('common.saved_filter.save_tooltip.when_empty');
    }
    return t('common.saved_filter.save_tooltip.default');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={!hasFilters}
            onClick={handleSave}
            className={isPristine ? '' : 'text-yellow-500'}
          >
            <SaveIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{getTooltipContent()}</TooltipContent>
    </Tooltip>
  );
}

export default SaveFilterButton;
