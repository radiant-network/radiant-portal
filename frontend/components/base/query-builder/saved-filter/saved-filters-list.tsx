import { useRef, useState } from 'react';
import { Check, ChevronDown, FolderIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { selectTriggerVariants } from '@/components/base/shadcn/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';
import ManageFiltersDialog from './manage-filters-dialog';

function SavedFiltersList() {
  const { t } = useI18n();
  const { savedFilters, selectedSavedFilter } = useSavedFiltersContext();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const dispatchQB = useQBDispatch();
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const isOpeningManageDialog = useRef(false);

  const handleValueChange = (savedFilterId: string) => {
    const selectedFilter = savedFilters.find(filter => filter.id === savedFilterId);
    dispatchSavedFilter({
      type: SavedFiltersActionType.SET_SELECTED,
      payload: selectedFilter,
    });
    // Dispatch saved filter sqons to query builder provider
    dispatchQB({
      type: QBActionType.LOAD_QUERIES,
      payload: selectedFilter?.queries,
    });
  };

  const handleManageAction = function () {
    isOpeningManageDialog.current = true;
    setOpenManageDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <Tooltip open={savedFilters.length > 0 ? false : undefined}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild disabled={savedFilters.length === 0}>
              <button
                type="button"
                className={selectTriggerVariants().base({ className: 'w-[135px] h-7' })}
                data-cy="my-filters-button"
              >
                <div className="flex items-center gap-2">
                  <FolderIcon size={14} /> {t('common.saved_filter.my_filters')}
                </div>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('common.saved_filter.no_saved_filters')}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="start"
          data-cy="saved-filter-content"
          onCloseAutoFocus={event => {
            // Let the manage dialog keep the focus instead of the trigger
            if (isOpeningManageDialog.current) {
              event.preventDefault();
              isOpeningManageDialog.current = false;
            }
          }}
        >
          {savedFilters.map(filter => {
            const isSelected = filter.id === selectedSavedFilter?.id;
            return (
              <DropdownMenuItem
                key={filter.id}
                role="menuitemradio"
                aria-checked={isSelected}
                className={cn({ 'bg-accent': isSelected })}
                onSelect={() => handleValueChange(filter.id)}
              >
                {filter.name}
                {isSelected && <Check className="ml-auto" />}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-medium" onSelect={handleManageAction}>
            {t('common.saved_filter.manage_filters')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageFiltersDialog open={openManageDialog} onOpenChange={setOpenManageDialog} />
    </>
  );
}

export default SavedFiltersList;
