import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { SavedFilterInstance } from '@/components/cores/query-builder';
import { SavedFilterTypeEnum } from '@/components/cores/saved-filter';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

const formSchema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
});

/**
 * Saved Filters edit dialog
 * - Allow the use to change filter name
 * - Display a notification on success or error
 */
function SavedFiltersEditDialog({
  open,
  onOpenChange,
  savedFilter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedFilter: SavedFilterInstance | null;
}) {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: savedFilter?.raw().name || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (savedFilter && !savedFilter.isNew()) {
      savedFilter
        .save(SavedFilterTypeEnum.Filter, { name: values.name })
        .then(() => {
          toast.success(dict.savedFilter.notifications.updated);
        })
        .catch(() => {
          toast.error(dict.savedFilter.notifications.errors.updated);
        });
    } else {
      queryBuilder
        .saveNewFilter({ name: values.name })
        .then(() => {
          toast.success(dict.savedFilter.notifications.created);
        })
        .catch(() => {
          toast.error(dict.savedFilter.notifications.errors.created);
        });
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.savedFilter.editDialog.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.savedFilter.editDialog.fields.title.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dict.savedFilter.editDialog.fields.title.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                schema={formSchema}
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{dict.savedFilter.editDialog.cancel}</Button>
              </DialogClose>
              <Button type="submit" color="primary">
                {dict.savedFilter.editDialog.ok}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SavedFiltersEditDialog;
