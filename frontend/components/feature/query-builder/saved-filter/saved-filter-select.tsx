import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/components/base/ui/select';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import { FolderIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/base/ui/button';
import SavedFiltersManageDialog from './saved-filter-manage-dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/base/ui/tooltip';

function SavedFiltersSelect() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();
  const savedFilters = queryBuilder.getSavedFilters().filter(filter => !filter.isNew());

  const [open, setOpen] = useState(false);
  const [openManage, setOpenManage] = useState(false);

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleManageAction = function () {
    setOpen(false);
    setOpenManage(true);
  };

  const selectKey = useMemo(() => new Date(), [selectedSavedFilter?.id]);

  return (
    <>
      <Select
        key={+selectKey}
        value={selectedSavedFilter?.id}
        onValueChange={savedFilterId => savedFilters.find(filter => filter.id === savedFilterId)?.select()}
        open={open}
        onOpenChange={setOpen}
        disabled={savedFilters.length === 0}
      >
        <Tooltip open={savedFilters.length > 0 ? false : undefined}>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-[135px] h-7">
              <div className="flex items-center gap-2">
                <FolderIcon size={14} /> {dict.savedFilter.myFilters}
              </div>
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>{dict.savedFilter.noSavedFilters}</TooltipContent>
        </Tooltip>
        <SelectContent>
          {savedFilters.map(filter => (
            <SelectItem key={filter.id} value={filter.id}>
              {filter.raw().title}
            </SelectItem>
          ))}
          <SelectSeparator />
          <Button size="sm" variant="ghost" className="w-full pl-2 justify-start" onClick={handleManageAction}>
            {dict.savedFilter.manageFilters}
          </Button>
        </SelectContent>
      </Select>
      <SavedFiltersManageDialog open={openManage} onOpenChange={setOpenManage} />
    </>
  );
}

export default SavedFiltersSelect;
