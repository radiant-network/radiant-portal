import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { SavedFilter, SavedFilterCreationInput, SavedFilterUpdateInput, Sqon } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { savedFiltersApi } from '@/utils/api';

import { Button } from '../../shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../shadcn/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../shadcn/form';
import { Input } from '../../shadcn/input';
import { useQBContext } from '../hooks/use-query-builder';
import { fetchSavedFilters } from '../query-builder';

import { SavedFiltersActionType, useSavedFiltersContext, useSavedFiltersDispatch } from './hooks/use-saved-filter';

interface UpdateFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedFilter?: SavedFilter;
  isFromManage?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
});

function UpdateFilterDialog({ open, onOpenChange, savedFilter, isFromManage = false }: UpdateFilterDialogProps) {
  const { t } = useI18n();
  const dispatch = useSavedFiltersDispatch();
  const { savedFilterType, selectedSavedFilter } = useSavedFiltersContext();
  const { sqons } = useQBContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: savedFilter?.name || '',
    },
  });

  const fetchFilters = useCallback(
    async (newSavedFilter: SavedFilter) => {
      await fetchSavedFilters(savedFilterType).then(response => {
        dispatch({
          type: SavedFiltersActionType.SAVE,
          payload: {
            savedFilters: response,
            selectedSavedFilter: isFromManage
              ? response.find((filter: SavedFilter) => filter.id === selectedSavedFilter?.id)
              : newSavedFilter,
          },
        });
      });
    },
    [savedFilterType, dispatch, isFromManage, selectedSavedFilter],
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (savedFilter) {
        // Update existing saved filter with the new name and current sqons
        // Save current sqon from QB only if it's the selected saved filter that is being edited
        const isSelectedEdition = selectedSavedFilter?.id === savedFilter.id;
        const updatedFilterData: SavedFilterUpdateInput = {
          ...savedFilter,
          name: values.name || t('common.saved_filter.untitled_filter'),
          queries: !isSelectedEdition ? savedFilter.queries : (sqons as Sqon[]),
        };
        const updatedSavedFilter = await savedFiltersApi.putSavedFilter(savedFilter.id, updatedFilterData);
        // Refresh saved filters list after update
        await fetchFilters(updatedSavedFilter.data);
        toast.success(t('common.saved_filter.notifications.updated'));
      } else {
        // Create a new saved filter with the name and current sqons
        const newFilterData: SavedFilterCreationInput = {
          name: values.name || t('common.saved_filter.untitled_filter'),
          queries: sqons as Sqon[],
          type: savedFilterType,
        };
        const newSavedFilter = await savedFiltersApi.postSavedFilter(newFilterData);
        // Refresh saved filters list after creation
        await fetchFilters(newSavedFilter.data);
        toast.success(t('common.saved_filter.notifications.created'));
      }
      onOpenChange(false);
    } catch (error: any) {
      if (error.response.data.detail.includes('unique_saved_filter')) {
        toast.error(t('common.saved_filter.notifications.errors.duplicated'));
        return;
      }
      if (savedFilter) {
        toast.error(t('common.saved_filter.notifications.errors.updated'));
        return;
      }
      toast.error(t('common.saved_filter.notifications.errors.created'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {savedFilter
              ? t('common.saved_filter.edit_dialog.edit_title')
              : t('common.saved_filter.edit_dialog.save_title')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.saved_filter.edit_dialog.fields.title.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('common.saved_filter.edit_dialog.fields.title.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                schema={formSchema}
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('common.cancel')}</Button>
              </DialogClose>
              <Button type="submit" color="primary">
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateFilterDialog;
