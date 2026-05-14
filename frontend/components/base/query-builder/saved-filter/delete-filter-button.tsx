import { useCallback } from 'react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { SavedFilter } from '@/api/index';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { savedFiltersApi } from '@/utils/api';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { fetchSavedFilters } from '../query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

export function openDeleteSavedFilterAlert(
  selectedSavedFilter: SavedFilter | undefined,
  fetchFilters: () => void,
  t: ReturnType<typeof useI18n>['t'],
) {
  alertDialog.open({
    type: 'warning',
    title: t('common.saved_filter.delete_dialog.title'),
    description: t('common.saved_filter.delete_dialog.description'),
    cancelProps: {
      children: t('common.cancel'),
    },
    actionProps: {
      color: 'destructive',
      onClick: async () => {
        try {
          if (selectedSavedFilter) {
            await savedFiltersApi.deleteSavedFilter(selectedSavedFilter.id);
            fetchFilters();
            toast.success(t('common.saved_filter.notifications.deleted'));
          }
        } catch (error) {
          toast.error(t('common.saved_filter.notifications.errors.deleted'));
        }
      },
      children: t('common.saved_filter.delete_dialog.ok'),
    },
  });
}

function DeleteFilterButton() {
  const { t } = useI18n();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const dispatchQB = useQBDispatch();
  const { selectedSavedFilter, savedFilterType } = useSavedFiltersContext();

  const fetchFilters = useCallback(() => {
    fetchSavedFilters(savedFilterType).then(response => {
      dispatchSavedFilter({
        type: SavedFiltersActionType.DELETE,
        payload: { savedFilters: response, selectedSavedFilter: undefined },
      });
      dispatchQB({ type: QBActionType.REMOVE_ALL_QUERIES });
    });
  }, [savedFilterType]);

  const getTooltipContent = () => {
    if (!selectedSavedFilter) {
      return t('common.saved_filter.no_filter_selected');
    }
    return t('common.saved_filter.delete_tooltip');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={!selectedSavedFilter}
            onClick={() => {
              openDeleteSavedFilterAlert(selectedSavedFilter, fetchFilters, t);
            }}
          >
            <TrashIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{getTooltipContent()}</TooltipContent>
    </Tooltip>
  );
}

export default DeleteFilterButton;
