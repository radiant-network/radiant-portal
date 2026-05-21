import { useCallback } from 'react';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { v4 } from 'uuid';

import { SavedFilter, SavedFilterCreationInput } from '@/api/api';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { savedFiltersApi } from '@/utils/api';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { fetchSavedFilters } from '../query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

/**
 * Generate a unique name for the duplicated filter by appending "COPY" and a counter if needed
 */
const generateUniqueName = (baseName: string, existingFilters: SavedFilter[]): string => {
  const existingNames = existingFilters.map(filter => filter.name);

  const tryName = (name: string, counter?: number): string => {
    const proposedName = counter ? `${baseName} COPY ${counter}` : `${baseName} COPY`;

    if (!existingNames.includes(proposedName)) {
      return proposedName;
    }

    return tryName(name, (counter || 0) + 1);
  };

  return tryName(baseName);
};

function DuplicateFilterButton() {
  const { t } = useI18n();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const dispatchQB = useQBDispatch();
  const { savedFilterType, selectedSavedFilter, isUnsaved, savedFilters } = useSavedFiltersContext();

  const fetchFilters = useCallback(
    (newSavedFilter: SavedFilter) => {
      fetchSavedFilters(savedFilterType).then(response => {
        dispatchSavedFilter({
          type: SavedFiltersActionType.SAVE,
          payload: { savedFilters: response, selectedSavedFilter: newSavedFilter },
        });
        dispatchQB({
          type: QBActionType.LOAD_QUERIES,
          payload: newSavedFilter.queries,
        });
      });
    },
    [savedFilterType, dispatchSavedFilter, dispatchQB],
  );

  const duplicateFilter = (selectedSavedFilter: SavedFilter) => {
    const uniqueName = generateUniqueName(selectedSavedFilter.name, savedFilters);
    const copiedQueries = selectedSavedFilter.queries.map(query => ({
      ...query,
      id: v4(),
    }));
    const duplicatedFilterData: SavedFilterCreationInput = {
      name: uniqueName,
      queries: copiedQueries,
      type: savedFilterType,
    };

    savedFiltersApi.postSavedFilter(duplicatedFilterData).then(duplicatedFilter => {
      fetchFilters(duplicatedFilter.data);
    });

    toast.success(t('common.saved_filter.notifications.created'));
  };

  const handleDuplicate = () => {
    if (!selectedSavedFilter) return;

    try {
      if (!isUnsaved) {
        duplicateFilter(selectedSavedFilter);
        return;
      }

      alertDialog.open({
        type: 'warning',
        title: t('common.saved_filter.overwrite_dialog.title'),
        description: t('common.saved_filter.overwrite_dialog.description'),
        cancelProps: {
          children: t('common.cancel'),
        },
        actionProps: {
          onClick: () => {
            duplicateFilter(selectedSavedFilter);
          },
          children: t('common.saved_filter.overwrite_dialog.ok'),
        },
      });
    } catch (error: any) {
      if (error.response.data.detail.includes('unique_saved_filter')) {
        toast.error(t('common.saved_filter.notifications.errors.duplicated'));
        return;
      }
      toast.error(t('common.saved_filter.notifications.errors.created'));
    }
  };

  const getTooltipContent = () => {
    if (!selectedSavedFilter) {
      return t('common.saved_filter.no_filter_selected');
    }
    return t('common.saved_filter.duplicate_tooltip');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button iconOnly variant="ghost" size="sm" disabled={!selectedSavedFilter} onClick={handleDuplicate}>
            <CopyIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{getTooltipContent()}</TooltipContent>
    </Tooltip>
  );
}

export default DuplicateFilterButton;
