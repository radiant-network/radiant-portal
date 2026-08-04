import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { Lock } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
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

import { PERMISSIONS_BY_CODE, roleName, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { Role } from '../../mock/types';

import PermissionPicker from './permission-picker';
import type { RoleFormValues } from './role-form.types';
import { roleFormSchema } from './role-sheet-schema';

type RoleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present = Edit (custom) or read-only View (default); absent/null = Add mode. */
  role?: Role | null;
  /** Add-mode prefill (Duplicate). Ignored when `role` is set. */
  initialValues?: RoleFormValues;
  /** All roles — for the duplicate-name check on create. */
  roles: Role[];
  onSave: (values: RoleFormValues, roleCode?: string) => void;
  onDuplicate: (role: Role) => void;
  onRequestDelete: (role: Role) => void;
};

const BLANK: RoleFormValues = { name: '', description: '', permissions: [] };

/** True while a warning/confirmation AlertDialog is mounted (it uses role="alertdialog"). */
const isAlertDialogOpen = () => typeof document !== 'undefined' && !!document.querySelector('[role="alertdialog"]');

function toFormValues(role: Role | null | undefined, initialValues: RoleFormValues | undefined): RoleFormValues {
  if (role) {
    // Default roles read their name from i18n (and aren't edited here); custom roles carry `label`.
    return {
      name: role.isDefault ? '' : role.label,
      description: role.description ?? '',
      permissions: role.permissions,
    };
  }
  return initialValues ?? BLANK;
}

/** Read-only permission list for a default role (name + scope badge + description). */
function RoleViewBody({ role, t }: { role: Role; t: TFunction<string, undefined> }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-foreground">{t('admin.role.view_permissions_heading')}</span>
      <ul className="flex flex-col gap-4">
        {role.permissions.map(code => {
          const scope = PERMISSIONS_BY_CODE[code]?.scope;
          return (
            <li key={code} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{t(`admin.permissions.${code}.name`)}</span>
                {scope && (
                  <Badge variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
                    {t(`admin.roles.scope.${scope}`)}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{t(`admin.permissions.${code}.description`)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
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
  const isEdit = !!role && !role.isDefault;
  const isView = !!role && role.isDefault; // default roles are read-only
  const isAdmin = !!role && role.code === 'tenant_admin';

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    values: toFormValues(role, initialValues),
  });

  const permissions = form.watch('permissions');
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
      const isDuplicate = roles.some(r => roleName(r, t).trim().toLowerCase() === values.name.trim().toLowerCase());
      if (isDuplicate) {
        form.setError('name', { message: 'role_name_duplicate' }, { shouldFocus: true });
        return;
      }
    }
    // An unchanged edit is a no-op that just closes (no save, no success toast).
    if (isEdit && !form.formState.isDirty) {
      onOpenChange(false);
      return;
    }
    onSave(values, role?.code);
    onOpenChange(false);
  };

  const onInvalid = () => setSubmitAttempted(true);

  let title = t('admin.role.add_title');
  if (isView) title = roleName(role!, t);
  else if (isEdit) title = t('admin.role.edit_title');

  // Footer varies by mode. add: Cancel/Create · edit: Delete/Duplicate — Cancel/Save ·
  // view (non-admin): Duplicate — Close · view (admin): reserved message — Close.
  const footer = (() => {
    if (isView) {
      return (
        <>
          {isAdmin ? (
            <span className="text-sm text-muted-foreground">{t('admin.role.admin_reserved_note')}</span>
          ) : (
            <Button type="button" variant="ghost" onClick={() => onDuplicate(role!)}>
              {t('admin.role.duplicate')}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('admin.role.close')}
          </Button>
        </>
      );
    }
    if (isEdit) {
      return (
        <>
          <div className="flex items-center gap-2">
            <Button type="button" variant="destructive" onClick={() => onRequestDelete(role!)}>
              {t('admin.role.delete')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => onDuplicate(role!)}>
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
      );
    }
    // Add / Duplicate
    return (
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
  })();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:w-[560px] sm:max-w-[560px]"
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
              <SheetTitle className="flex items-center gap-1.5 text-lg">
                {title}
                {isView && <Lock className="size-4 text-muted-foreground" />}
              </SheetTitle>
              {/* Roles are abstract, so the sheet leads with a strong orienting line. */}
              <SheetDescription>
                {isView ? t('admin.role.view_description') : t('admin.role.description')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              {isView ? (
                <RoleViewBody role={role!} t={t} />
              ) : (
                <>
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
                </>
              )}
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
