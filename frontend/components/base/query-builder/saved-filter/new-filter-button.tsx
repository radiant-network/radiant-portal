import { PlusIcon } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';

import { alertDialog } from '../../dialog/alert-dialog-store';
import { Button } from '../../shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../shadcn/tooltip';
import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

function NewFilterButton() {
  const { t } = useI18n();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const dispatchQB = useQBDispatch();
  const { selectedSavedFilter, isUnsaved } = useSavedFiltersContext();

  function handleNew() {
    if (!isUnsaved) {
      dispatchSavedFilter({ type: SavedFiltersActionType.SET_SELECTED, payload: undefined });
      dispatchQB({ type: QBActionType.REMOVE_ALL_QUERIES });
      return;
    }

    alertDialog.open({
      type: 'warning',
      title: t('common.saved_filter.overwrite_dialog.title'),
      description: t('common.saved_filter.overwrite_dialog.description'),
      cancelProps: {
        children: t('common.saved_filter.overwrite_dialog.cancel'),
      },
      actionProps: {
        onClick: () => {
          dispatchSavedFilter({ type: SavedFiltersActionType.SET_SELECTED, payload: undefined });
          dispatchQB({ type: QBActionType.REMOVE_ALL_QUERIES });
        },
        children: t('common.saved_filter.overwrite_dialog.ok'),
      },
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button iconOnly variant="ghost" size="sm" onClick={handleNew} disabled={!selectedSavedFilter}>
            <PlusIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('common.saved_filter.new_filter')}</TooltipContent>
    </Tooltip>
  );
}

export default NewFilterButton;
