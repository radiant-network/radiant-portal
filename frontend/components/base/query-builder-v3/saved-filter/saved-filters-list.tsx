import { useState } from 'react';
import { FolderIcon } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/base/shadcn/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

function SavedFiltersList() {
  const { t } = useI18n();
  const { savedFilters, selectedSavedFilter } = useSavedFiltersContext();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const dispatchQB = useQBDispatch();
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <Select
        value={selectedSavedFilter?.id || ''}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={setOpen}
        disabled={savedFilters.length === 0}
      >
        <Tooltip open={savedFilters.length > 0 ? false : undefined}>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-[135px] h-7">
              <div className="flex items-center gap-2">
                <FolderIcon size={14} /> {t('common.saved_filter.my_filters')}
              </div>
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('common.saved_filter.no_saved_filters')}</TooltipContent>
        </Tooltip>
        <SelectContent>
          {savedFilters.map(filter => (
            <SelectItem key={filter.id} value={filter.id}>
              {filter.name}
            </SelectItem>
          ))}
          {/* <SelectSeparator /> */}
          {/* <Button size="sm" variant="ghost" className="w-full pl-2 justify-start" onClick={handleManageAction}>
            {t('common.saved_filter.manage_filters')}
          </Button> */}
        </SelectContent>
      </Select>
      {/* <SavedFiltersManageDialog open={openManage} onOpenChange={setOpenManage} /> */}
    </>
  );
}

export default SavedFiltersList;
