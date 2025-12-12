import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { QueryInstance } from '@/components/cores/query-builder';

import { useQueryBuilderDictContext } from '../query-builder-context';

const formSchema = z.object({
  title: z.string(),
});

function QueryBarSaveDialog({
  open,
  onOpenChange,
  query,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: QueryInstance;
}) {
  const [saving, setSaving] = useState(false);
  const dict = useQueryBuilderDictContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true);
    return Promise.resolve(query.saveAsCustomPill(values.title))
      .then(() => onOpenChange(false))
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.queryBar.saveDialog.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.queryBar.saveDialog.fields.title.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dict.queryBar.saveDialog.fields.title.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm">{dict.queryBar.saveDialog.notice}</div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{dict.queryBar.saveDialog.cancel}</Button>
              </DialogClose>
              <Button type="submit" color="primary" loading={saving}>
                {dict.queryBar.saveDialog.ok}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default QueryBarSaveDialog;
