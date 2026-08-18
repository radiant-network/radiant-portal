import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import type { OrganizationResponse } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
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

const ORGANIZATION_CODE_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const createFormSchema = z.object({
  name: z.string().min(1, 'required'),
  code: z.string().min(1, 'required').max(MAX_CODE_LENGTH, 'max_50').regex(ORGANIZATION_CODE_PATTERN, 'invalid_code'),
  category_code: z.string().min(1, 'required'),
});

const editFormSchema = createFormSchema.extend({
  code: z.string(),
  category_code: z.string(),
});

type FormValues = z.infer<typeof createFormSchema>;

const EMPTY_FORM: FormValues = { name: '', code: '', category_code: '' };

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>
      <Input value={value ?? ''} readOnly disabled />
    </div>
  );
}

type OrganizationFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: OrganizationResponse;
  onSaved: () => void;
};

function OrganizationFormSheet({ open, onOpenChange, organization, onSaved }: OrganizationFormSheetProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { data: categories } = useOrganizationCategories();

  const isEdit = !!organization;
  const i18nPrefix = isEdit ? 'admin.organizations.edit' : 'admin.organizations.create';
  const formSchema = isEdit ? editFormSchema : createFormSchema;

  const [isCodeEdited, setIsCodeEdited] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  const name = form.watch('name');
  const { isSubmitted } = form.formState;

  useEffect(() => {
    if (!open) return;
    form.reset(organization ? { ...EMPTY_FORM, name: organization.name ?? '' } : EMPTY_FORM);
    setIsCodeEdited(false);
  }, [open, organization, form]);

  useEffect(() => {
    if (isEdit || isCodeEdited) return;
    form.setValue('code', toOrganizationCode(name), { shouldValidate: isSubmitted });
  }, [name, isEdit, isCodeEdited, isSubmitted, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (organization) {
        const updatedName = values.name.trim();
        // An unchanged submit is a no-op: the sheet closes with no request and no toast.
        if (updatedName === organization.name) {
          onOpenChange(false);
          return;
        }
        await organizationsApi.updateOrganization(tenant, organization.code!, { name: updatedName });
      } else {
        await organizationsApi.createOrganization(tenant, values);
      }
      toast.success(t(`${i18nPrefix}.notifications.success`));
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      if (!isEdit && error?.response?.status === 409) {
        form.setError('code', { message: 'organization_code_exists' });
        return;
      }
      toast.error(t(`${i18nPrefix}.notifications.errors.default`));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 max-sm:w-full sm:max-w-[480px]">
        <SheetHeader className="border-b p-6">
          <SheetTitle>{t(`${i18nPrefix}.title`)}</SheetTitle>
          <SheetDescription>{t(`${i18nPrefix}.description`)}</SheetDescription>
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
                    <FormLabel>{t('admin.organizations.fields.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isEdit ? (
                <>
                  <ReadOnlyField label={t('admin.organizations.fields.code')} value={organization.code} />
                  <ReadOnlyField label={t('admin.organizations.fields.category')} value={organization.category_name} />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    schema={formSchema}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.organizations.fields.code')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={MAX_CODE_LENGTH}
                            onChange={event => {
                              setIsCodeEdited(true);
                              field.onChange(toCodeCharset(event.target.value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>{t('admin.organizations.fields.code_hint')}</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    schema={formSchema}
                    name="category_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.organizations.fields.category')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t('admin.organizations.fields.category_placeholder')} />
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
                        <FormDescription>{t('admin.organizations.fields.category_hint')}</FormDescription>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <SheetFooter className="border-t p-6 flex-row justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t(`${i18nPrefix}.submit`)}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
export default OrganizationFormSheet;
