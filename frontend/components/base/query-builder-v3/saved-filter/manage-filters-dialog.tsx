import { useCallback, useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { enCA } from 'date-fns/locale/en-CA';
import { frCA } from 'date-fns/locale/fr-CA';

import { SavedFilter } from '@/api/index';
import List from '@/components/base/list/list';
import ListItemAction from '@/components/base/list/list-item-with-action';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { fetchSavedFilters } from '../query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';
import { openDeleteSavedFilterAlert } from './delete-filter-button';
import UpdateFilterDialog from './update-filter-dialog';

function SavedFiltersManageDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const { savedFilters } = useSavedFiltersContext();

  useEffect(() => {
    if (savedFilters.length === 0) {
      onOpenChange(false);
    }
  }, [savedFilters]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t('common.saved_filter.manage_dialog.title')}</DialogTitle>
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
            <Button>{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SavedFilterListItem = ({ savedFilter }: { savedFilter: SavedFilter }) => {
  const { currentLanguage, t } = useI18n();
  const dispatchQB = useQBDispatch();
  const dispatchSavedFilter = useSavedFiltersDispatch();
  const { selectedSavedFilter, savedFilterType } = useSavedFiltersContext();
  const [openEdit, setOpenEdit] = useState(false);

  const getLastSaveAtDisplay = useCallback(() => {
    if (!savedFilter.updated_on) {
      return t('common.saved_filter.manage_dialog.last_save_at', { lastSaveAt: 'n/a' });
    }

    const lastSaveAt = formatDistance(new Date(), new Date(savedFilter.updated_on), {
      locale: currentLanguage === 'fr' ? frCA : enCA,
    });

    return t('common.saved_filter.manage_dialog.last_save_at', { lastSaveAt });
  }, [savedFilter.updated_on, currentLanguage]);

  const fetchFilters = useCallback(() => {
    fetchSavedFilters(savedFilterType).then(response => {
      const selectedFilter = response.find((filter: SavedFilter) => filter.id === savedFilter.id);
      dispatchSavedFilter({
        type: SavedFiltersActionType.DELETE,
        payload: { savedFilters: response, selectedSavedFilter: selectedFilter },
      });
      dispatchQB({ type: QBActionType.REMOVE_ALL_QUERIES });
    });
  }, [savedFilterType]);

  const isSelectedEdition = selectedSavedFilter?.id === savedFilter.id;

  return (
    <>
      <ListItemAction
        key={savedFilter.id}
        title={savedFilter.name}
        description={getLastSaveAtDisplay()}
        className="border-b last:border-b-0 relative px-3 py-2 group"
        onEdit={() => setOpenEdit(true)}
        onDelete={() => openDeleteSavedFilterAlert(savedFilter, fetchFilters, t)}
      />
      {openEdit && (
        <UpdateFilterDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          savedFilter={savedFilter}
          isSelectedEdition={isSelectedEdition}
        />
      )}
    </>
  );
};

export default SavedFiltersManageDialog;
