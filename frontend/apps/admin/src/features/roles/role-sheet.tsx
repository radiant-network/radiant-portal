import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
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
import { cn } from '@/components/lib/utils';

import { roleName } from '../../mock/data';
import type { Role } from '../../mock/types';

import PermissionPicker from './permission-picker';
import type { RoleFormValues } from './role-form.types';
import { roleFormSchema } from './role-sheet-schema';

type RoleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present = Edit (custom role only); absent/null = Add mode. Default roles never open the sheet. */
  role?: Role | null;
  /** Add-mode prefill (Duplicate). Ignored when `role` is set. */
  initialValues?: RoleFormValues;
  /** All roles — for the duplicate-name check on create. */
  roles: Role[];
  onSave: (values: RoleFormValues, roleCode?: string) => void;
  onDuplicate: (role: Role) => void;
  onRequestDelete: (role: Role) => void;
};

const BLANK: RoleFormValues = { name: '', code: '', description: '', permissions: [] };

/** True while a warning/confirmation AlertDialog is mounted (it uses role="alertdialog"). */
const isAlertDialogOpen = () => typeof document !== 'undefined' && !!document.querySelector('[role="alertdialog"]');

/**
 * Suggest a code slug from the name: lowercase, non-alphanumerics → underscore, collapsed, forced
 * to start with a letter, and capped at 50 (backend rule `[a-z][a-z0-9_]*`, max 50). Only a
 * starting point — the user can edit it. Uses `.replace(/…/g)` (not `String.replaceAll`) to stay
 * ES2020-safe. Mirrors the org sheet's `slugifyCode`.
 */
function slugifyCode(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[^a-z]+/, '')
    .replace(/_+$/, '')
    .slice(0, 50);
}

function toFormValues(role: Role | null | undefined, initialValues: RoleFormValues | undefined): RoleFormValues {
  if (role) {
    return {
      name: role.label,
      code: role.code,
      description: role.description ?? '',
      permissions: role.permissions,
    };
  }
  return initialValues ?? BLANK;
}

export default function RoleSheet({
  open,
  onOpenChange,
  role,
  initialValues,
  roles,
  onSave,
  onDuplicate,
  onRequestDelete,
}: RoleSheetProps) {
  const { t } = useI18n();
  const isEdit = !!role;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    values: toFormValues(role, initialValues),
  });

  const permissions = form.watch('permissions');

  // On Add, auto-fill the code from the name until the user edits the code themselves; then leave
  // it alone. Reset the "touched" flag whenever the sheet (re)opens. (Mirrors the org sheet.)
  const [codeTouched, setCodeTouched] = useState(false);
  useEffect(() => {
    if (open) setCodeTouched(isEdit);
  }, [open, isEdit]);

  const name = form.watch('name');
  useEffect(() => {
    if (!isEdit && !codeTouched) {
      form.setValue('code', slugifyCode(name), { shouldValidate: false });
    }
  }, [name, codeTouched, isEdit, form]);

  // Read isDirty during render so RHF's formState Proxy actually tracks it; accessed only inside the
  // submit handler it stays stale (false), which wrongly short-circuits every edit as a no-op.
  const { isDirty } = form.formState;
  // Submit stays enabled; the first submit attempt reveals inline validation (name via RHF, the
  // permissions "pick at least one" rule manually — the picker isn't a native input RHF can focus).
  const [submitAttempted, setSubmitAttempted] = useState(false);
  useEffect(() => {
    setSubmitAttempted(false);
  }, [open, role, initialValues]);

  const permissionsError = submitAttempted && permissions.length === 0;

  const onValid = (values: RoleFormValues) => {
    if (values.permissions.length === 0) {
      setSubmitAttempted(true);
      return;
    }
    if (!isEdit) {
      // Create: enforce a unique display name within the tenant (case-insensitive).
      const nameTaken = roles.some(r => roleName(r, t).trim().toLowerCase() === values.name.trim().toLowerCase());
      if (nameTaken) {
        form.setError('name', { message: 'role_name_duplicate' }, { shouldFocus: true });
        return;
      }
      // And a unique code (backend 409 on the (code, tenant) PK) — clashes with a default role's
      // code count too, since defaults live in the same `roles` set.
      const codeTaken = roles.some(r => r.code.toLowerCase() === values.code.trim().toLowerCase());
      if (codeTaken) {
        form.setError('code', { message: 'role_code_duplicate' }, { shouldFocus: true });
        return;
      }
    }
    // An unchanged edit is a no-op that just closes (no save, no success toast).
    if (isEdit && !isDirty) {
      onOpenChange(false);
      return;
    }
    // The page owns closing after save: a straight save closes the sheet, while editing an assigned
    // role's permissions opens a confirm dialog first and closes only once it's confirmed.
    onSave(values, role?.code);
  };

  const onInvalid = () => setSubmitAttempted(true);

  const title = isEdit ? t('admin.role.edit_title') : t('admin.role.add_title');

  // Footer varies by mode. add: Cancel/Create · edit: Delete/Duplicate — Cancel/Save.
  const footer = isEdit ? (
    <>
      <div className="flex items-center gap-2">
        <Button type="button" variant="destructive" onClick={() => onRequestDelete(role!)}>
          {t('admin.role.delete')}
        </Button>
        <Button type="button" variant="ghost" onClick={() => onDuplicate(role!)}>
          <Copy />
          {t('admin.role.duplicate')}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          {t('admin.role.cancel')}
        </Button>
        <Button type="submit">{t('admin.role.save')}</Button>
      </div>
    </>
  ) : (
    <>
      <span />
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          {t('admin.role.cancel')}
        </Button>
        <Button type="submit">{t('admin.role.create')}</Button>
      </div>
    </>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:w-[680px] sm:max-w-[680px]"
        // Dismissing a stacked delete-confirm dialog must not also close the sheet.
        onInteractOutside={e => {
          if (isAlertDialogOpen()) e.preventDefault();
        }}
        onEscapeKeyDown={e => {
          if (isAlertDialogOpen()) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="flex h-full flex-col overflow-hidden">
            <SheetHeader className="space-y-1.5 border-b px-6 py-4">
              <SheetTitle className="text-lg">{title}</SheetTitle>
              {/* Roles are abstract, so the sheet leads with a strong orienting line. */}
              <SheetDescription>{t('admin.role.description')}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <FormField
                control={form.control}
                name="name"
                schema={roleFormSchema}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('admin.role.name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('admin.role.name_placeholder')}
                        className={cn(fieldState.error && 'border-destructive')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isEdit ? (
                // Code is immutable after creation → read-only. Shown as-is (lowercase); unlike org
                // codes it's never surfaced elsewhere, so no uppercase display transform.
                <div className="flex flex-col gap-2.5">
                  <FormLabel className="text-foreground">{t('admin.role.code')}</FormLabel>
                  <Input value={role!.code} readOnly disabled />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="code"
                  schema={roleFormSchema}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('admin.role.code')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          // Codes are stored lowercase; keep the field lowercase as the user types.
                          onChange={e => {
                            setCodeTouched(true);
                            field.onChange(e.target.value.toLowerCase());
                          }}
                          className={cn(fieldState.error && 'border-destructive')}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">{t('admin.role.code_hint')}</p>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                // Description is optional; pass no schema so FormLabel skips the required asterisk.
                schema={null}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.role.description_label')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={t('admin.role.description_placeholder')} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <FormLabel className="text-foreground">{t('admin.role.permissions_label')}</FormLabel>
                  <p className="text-sm text-muted-foreground">{t('admin.role.permissions_hint')}</p>
                </div>
                <PermissionPicker
                  value={permissions}
                  onChange={next => form.setValue('permissions', next, { shouldDirty: true })}
                  invalid={permissionsError}
                />
                {permissionsError && (
                  <p className="text-sm text-destructive">{t('admin.role.err.at_least_one_permission')}</p>
                )}
              </div>
            </div>

            <SheetFooter className="flex-row items-center justify-between border-t p-6 sm:justify-between">
              {footer}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
