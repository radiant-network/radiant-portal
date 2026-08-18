import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/base/shadcn/sheet';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { organizationsApi } from '@/utils/api';

import { MAX_CODE_LENGTH, toCodeCharset, toOrganizationCode } from './organizations-utils';
import { useOrganizationCategories } from './use-organization-categories';

const ORGANIZATION_CODE_PATTERN = /^[a-z][a-z0-9_]*$/;

const formSchema = z.object({
  name: z.string().min(1, 'required'),
  code: z.string().min(1, 'required').max(MAX_CODE_LENGTH, 'max_50').regex(ORGANIZATION_CODE_PATTERN, 'invalid_code'),
  category_code: z.string().min(1, 'required'),
});

type FormValues = z.infer<typeof formSchema>;

const EMPTY_FORM: FormValues = { name: '', code: '', category_code: '' };

type CreateOrganizationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

function CreateOrganizationSheet({ open, onOpenChange, onCreated }: CreateOrganizationSheetProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { data: categories } = useOrganizationCategories();

  const [isCodeEdited, setIsCodeEdited] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  const name = form.watch('name');
  const { isSubmitted } = form.formState;

  useEffect(() => {
    if (isCodeEdited) return;
    form.setValue('code', toOrganizationCode(name), { shouldValidate: isSubmitted });
  }, [name, isCodeEdited, isSubmitted, form]);

  useEffect(() => {
    if (open) return;
    form.reset(EMPTY_FORM);
    setIsCodeEdited(false);
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await organizationsApi.createOrganization(tenant, values);
      toast.success(t('admin.organizations.create.notifications.success'));
      onCreated();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        form.setError('code', { message: 'organization_code_exists' });
        return;
      }
      toast.error(t('admin.organizations.create.notifications.errors.default'));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b p-6">
          <SheetTitle>{t('admin.organizations.create.title')}</SheetTitle>
          <SheetDescription>{t('admin.organizations.create.description')}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <FormField
                control={form.control}
                schema={formSchema}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.organizations.create.fields.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                schema={formSchema}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.organizations.create.fields.code')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="uppercase"
                        maxLength={MAX_CODE_LENGTH}
                        onChange={event => {
                          setIsCodeEdited(true);
                          field.onChange(toCodeCharset(event.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>{t('admin.organizations.create.fields.code_hint')}</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                schema={formSchema}
                name="category_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.organizations.create.fields.category')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('admin.organizations.create.fields.category_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(categories ?? [])
                          .filter(category => !!category.code)
                          .map(category => (
                            <SelectItem key={category.code} value={category.code!}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>{t('admin.organizations.create.fields.category_hint')}</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="border-t p-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t('admin.organizations.create.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
export default CreateOrganizationSheet;
