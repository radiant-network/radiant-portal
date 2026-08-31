import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyIcon } from 'lucide-react';
import { z } from 'zod';

import type { RoleResult } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/base/shadcn/sheet';
import { Textarea } from '@/components/base/shadcn/textarea';
import { useI18n } from '@/components/hooks/i18n';

import RolePermissionPicker from './role-permission-picker';
import { MAX_ROLE_CODE_LENGTH, ROLE_CODE_PATTERN, toRoleCode, toRoleCodeCharset } from './roles-utils';

const formSchema = z.object({
  name: z.string().min(1, 'required'),
  code: z.string().min(1, 'required').max(MAX_ROLE_CODE_LENGTH, 'max_50').regex(ROLE_CODE_PATTERN, 'invalid_role_code'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'at_least_one_permission'),
});

export type RoleFormValues = z.infer<typeof formSchema>;

type FormValues = RoleFormValues;

const EMPTY_FORM: FormValues = { name: '', code: '', description: '', permissions: [] };

// Needed to manage alert closing without impact on sheet display
const isAlertDialogOpen = () => !!document.querySelector('[role="alertdialog"]');

function toFormValues(role: RoleResult, isDuplicate: boolean, copySuffix: string): FormValues {
  return {
    name: isDuplicate ? `${role.name} ${copySuffix}` : role.name,
    code: isDuplicate ? '' : role.code,
    description: role.description ?? '',
    permissions: role.actions.map(action => action.code),
  };
}

type RoleFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: RoleResult;
  isDuplicate?: boolean;
  onSave: (values: RoleFormValues, helpers: { setDuplicateError: (field: 'name' | 'code') => void }) => void;
  onDelete?: (role: RoleResult) => void;
  onDuplicate?: (role: RoleResult) => void;
};

function RoleFormSheet({
  open,
  onOpenChange,
  role,
  isDuplicate = false,
  onSave,
  onDelete,
  onDuplicate,
}: RoleFormSheetProps) {
  const { t } = useI18n();

  const isEdit = !!role && !isDuplicate;
  const [isCodeEdited, setIsCodeEdited] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  const name = form.watch('name');
  const permissions = form.watch('permissions');
  const { isSubmitted } = form.formState;

  useEffect(() => {
    if (!open) return;
    form.reset(role ? toFormValues(role, isDuplicate, t('admin.roles.duplicate_suffix')) : EMPTY_FORM);
    setIsCodeEdited(false);
  }, [open, role, isDuplicate, form, t]);

  // The code follows the name until it is typed into, and never in Edit where it is read-only.
  useEffect(() => {
    if (isEdit || isCodeEdited) return;
    form.setValue('code', toRoleCode(name), { shouldValidate: isSubmitted });
  }, [name, isEdit, isCodeEdited, isSubmitted, form]);

  const onSubmit = (values: FormValues) =>
    onSave(values, {
      setDuplicateError: field =>
        form.setError(field, { message: field === 'code' ? 'role_code_exists' : 'role_name_exists' }),
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0 max-sm:w-full sm:max-w-[680px]"
        onInteractOutside={event => {
          if (isAlertDialogOpen()) event.preventDefault();
        }}
        onEscapeKeyDown={event => {
          if (isAlertDialogOpen()) event.preventDefault();
        }}
      >
        <SheetHeader className="border-b p-6">
          <SheetTitle>{t(isEdit ? 'admin.roles.edit.title' : 'admin.roles.create.title')}</SheetTitle>
          <SheetDescription>{t('admin.roles.create.description')}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <FormField
                control={form.control}
                schema={formSchema}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.roles.fields.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin.roles.fields.name_placeholder')} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isEdit ? (
                <div className="space-y-2.5">
                  <Label>{t('admin.roles.fields.code')}</Label>
                  <Input value={role.code} readOnly disabled />
                  <FormDescription>{t('admin.roles.fields.code_hint')}</FormDescription>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  schema={formSchema}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.roles.fields.code')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={MAX_ROLE_CODE_LENGTH}
                          onChange={event => {
                            setIsCodeEdited(true);
                            field.onChange(toRoleCodeCharset(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>{t('admin.roles.fields.code_hint')}</FormDescription>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                schema={formSchema}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.roles.fields.description')}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder={t('admin.roles.fields.description_placeholder')} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                schema={formSchema}
                name="permissions"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('admin.roles.fields.permissions')}</FormLabel>
                    <FormDescription>{t('admin.roles.fields.permissions_hint')}</FormDescription>
                    <RolePermissionPicker
                      value={permissions}
                      onChange={next => form.setValue('permissions', next, { shouldValidate: isSubmitted })}
                      invalid={!!fieldState.error}
                    />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="border-t p-6 flex-row items-center justify-between sm:justify-between">
              <div className="flex items-center gap-2">
                {isEdit && (
                  <>
                    <Button type="button" variant="destructive" onClick={() => onDelete?.(role)}>
                      {t('admin.roles.delete.action')}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => onDuplicate?.(role)}>
                      <CopyIcon />
                      {t('admin.roles.table.duplicate')}
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t(isEdit ? 'admin.roles.edit.submit' : 'admin.roles.create.submit')}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
export default RoleFormSheet;
