import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/ui/dialog';
import { Button } from '@/components/base/ui/button';
import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import List from '@/components/base/list/list';
import ListItemAction from '@/components/base/list/list-item-with-action';
import { SavedFilterInstance } from '@/components/model/query-builder-core';
import SavedFiltersEditDialog from './saved-filter-edit-dialog';
import { frCA } from 'date-fns/locale/fr-CA';
import { formatDistance } from 'date-fns';
import { ISavedFilter } from '@/components/model/saved-filter';
import { openDeleteSavedFilterAlert } from '../alerts';

function SavedFiltersManageDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const savedFilters = queryBuilder.getSavedFilters().filter(savedFilter => !savedFilter.isNew());

  useEffect(() => {
    if (savedFilters.length === 0) {
      onOpenChange(false);
    }
  }, [savedFilters]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{dict.savedFilter.manageDialog.title}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <List bordered className="max-h-[250px]">
              {savedFilters.map(savedFilter => (
                <SavedFilterListItem key={savedFilter.id} savedFilter={savedFilter} />
              ))}
            </List>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button>{dict.savedFilter.manageDialog.close}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const SavedFilterListItem = ({ savedFilter }: { savedFilter: SavedFilterInstance }) => {
  const dict = useQueryBuilderDictContext();

  const [openEdit, setOpenEdit] = useState(false);

  const getLastSaveAtDisplay = useCallback(() => {
    const savedFilterObj = savedFilter.raw() as ISavedFilter & {
      updated_date: string;
    };

    if (!savedFilterObj.updated_date) {
      return dict.savedFilter.manageDialog.lastSaveAt.replace('{lastSaveAt}', 'n/a');
    }

    const lastSaveAt = formatDistance(new Date(), new Date(savedFilterObj.updated_date), {
      locale: frCA,
    });

    return dict.savedFilter.manageDialog.lastSaveAt.replace('{lastSaveAt}', lastSaveAt);
  }, [savedFilter.raw()]);

  return (
    <>
      <ListItemAction
        key={savedFilter.id}
        title={savedFilter.raw().title}
        description={getLastSaveAtDisplay()}
        className="border-b last:border-b-0 relative px-3 py-2 group"
        onEdit={() => setOpenEdit(true)}
        onDelete={() => openDeleteSavedFilterAlert(savedFilter, dict)}
      />
      <SavedFiltersEditDialog open={openEdit} onOpenChange={setOpenEdit} savedFilter={savedFilter} />
    </>
  );
};

export default SavedFiltersManageDialog;
