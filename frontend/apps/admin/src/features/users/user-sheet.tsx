import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import ViewPermissionsDialog from '../../components/view-permissions-dialog';
import { ADMIN_ROLE, MEMBER_ROLE, MOCK_TENANT, roleIsOrgScoped, ROLES_BY_CODE } from '../../mock/data';
import type { AdminUser, Role } from '../../mock/types';

import AdminRoleToggle from './admin-role-toggle';
import RoleCheckboxGroup from './role-checkbox-group';
import type { RoleAssignmentForm, UserFormValues } from './user-form.types';
import { userFormSchema } from './user-sheet-schema';

type UserSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present = Edit mode; absent/null = Add mode. */
  user?: AdminUser | null;
  /** All tenant users — for last-admin detection. */
  users: AdminUser[];
  onSave: (values: UserFormValues, userId?: string) => void;
  onDelete: (user: AdminUser) => void;
};

function toFormValues(user?: AdminUser | null): UserFormValues {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    assignments: (user?.roles ?? []).map(r => ({ roleCode: r.roleCode, orgCodes: r.orgCodes ?? [] })),
  };
}

/** True while a warning/confirmation AlertDialog is mounted (it uses role="alertdialog"). */
const isAlertDialogOpen = () => typeof document !== 'undefined' && !!document.querySelector('[role="alertdialog"]');

export default function UserSheet({ open, onOpenChange, user, users, onSave, onDelete }: UserSheetProps) {
  const { t } = useI18n();
  const isEdit = !!user;
  // Self-action guards: privileged users editing their own account can't self-escalate to Tenant Admin
  // or delete their own account. Both are static "this row is you" conditions → shown as disabled
  // (vs. the dynamic last-admin veto). See Build Tracker: Users / Inc 2 hardening.
  const isSelf = isEdit && !!user?.isCurrentUser;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    values: toFormValues(user),
  });

  const assignments = form.watch('assignments');
  // Read isDirty during render so RHF's formState Proxy actually tracks it; accessed only inside the
  // submit handler it stays stale (false), which wrongly short-circuits every edit as a no-op.
  const { isDirty } = form.formState;

  // Shared "view permissions" dialog, owned here so both the role boxes and the baseline line
  // (member role) can open it.
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);
  // Submit buttons stay enabled; on the first submit attempt we reveal inline validation instead.
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const hasAdmin = assignments.some(a => a.roleCode === 'tenant_admin');
  // Self-guard: you can't grant yourself Administrator (grant-only — if already held it stays
  // toggleable so removal still routes through the last-admin veto below).
  const adminGrantLocked = isSelf && !hasAdmin;

  // Org-required: every checked org-scoped role must target ≥1 organization (or all). Offending
  // roles surface an inline error on their picker once a submit has been attempted.
  const orgErrorRoleCodes = assignments
    .filter(a => {
      const role = ROLES_BY_CODE[a.roleCode];
      return role && roleIsOrgScoped(role) && a.orgCodes.length === 0;
    })
    .map(a => a.roleCode);

  const otherAdminCount = users.filter(
    u => u.id !== user?.id && u.roles.some(r => r.roleCode === 'tenant_admin'),
  ).length;

  const handleAssignmentsChange = (next: RoleAssignmentForm[]) => {
    // Last-admin protection: block removing tenant_admin from the last enabled admin.
    const removingAdmin =
      assignments.some(a => a.roleCode === 'tenant_admin') && !next.some(a => a.roleCode === 'tenant_admin');
    if (isEdit && removingAdmin && otherAdminCount === 0) {
      alertDialog.open({
        type: 'warning',
        title: t('admin.user.err.last_admin_title'),
        description: t('admin.user.err.last_admin', {
          name: `${user!.firstName} ${user!.lastName}`,
          tenant: MOCK_TENANT.name,
        }),
        hideCancel: true,
        actionProps: { children: t('admin.user.understood') },
      });
      return; // veto the change
    }
    form.setValue('assignments', next, { shouldDirty: true });
  };

  const toggleAdmin = (checked: boolean) => {
    const next = checked
      ? [...assignments, { roleCode: 'tenant_admin', orgCodes: [] }]
      : assignments.filter(a => a.roleCode !== 'tenant_admin');
    handleAssignmentsChange(next); // reuses the last-admin veto
  };

  const handleDelete = () => {
    if (!user) return;
    // Last-admin protection: deleting the only tenant_admin would leave the tenant with no admin.
    const userIsLastAdmin = user.roles.some(r => r.roleCode === 'tenant_admin') && otherAdminCount === 0;
    if (userIsLastAdmin) {
      alertDialog.open({
        type: 'warning',
        title: t('admin.user.err.last_admin_title'),
        description: t('admin.user.err.last_admin_delete', {
          name: `${user.firstName} ${user.lastName}`,
          tenant: MOCK_TENANT.name,
        }),
        hideCancel: true,
        actionProps: { children: t('admin.user.understood') },
      });
      return; // veto the delete
    }
    alertDialog.open({
      type: 'warning',
      title: t('admin.user.delete_title', { name: `${user.firstName} ${user.lastName}` }),
      description: t('admin.user.delete_body', { name: user.firstName, tenant: MOCK_TENANT.name }),
      cancelProps: { children: t('admin.user.cancel') },
      actionProps: {
        color: 'destructive',
        dataCy: 'delete-user-confirm',
        children: t('admin.user.delete_confirm'),
        onClick: async () => {
          onDelete(user);
          onOpenChange(false);
        },
      },
    });
  };

  // Identity fields passed zod validation. Still block on a missing org (revealing the inline error);
  // an unchanged edit is a no-op that just closes (no save, no success toast).
  const onValid = (values: UserFormValues) => {
    if (orgErrorRoleCodes.length > 0) {
      setSubmitAttempted(true);
      return;
    }
    if (isEdit && !isDirty) {
      onOpenChange(false);
      return;
    }
    onSave(values, user?.id);
    onOpenChange(false);
  };

  // Identity validation failed — RHF shows the field messages and focuses the first invalid input.
  // Reveal any org-picker errors too, so one click surfaces everything.
  const onInvalid = () => setSubmitAttempted(true);

  // Footer left slot: Delete in edit mode; on your own account it's disabled with a self-guard tooltip
  // (wrapped in a focusable span so the tooltip still fires — disabled controls emit no hover/focus events).
  let deleteSlot = <span />;
  if (isSelf) {
    deleteSlot = (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex">
              <Button type="button" variant="destructive" disabled aria-disabled className="pointer-events-none">
                {t('admin.user.delete')}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('admin.user.err.self_delete')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (isEdit) {
    deleteSlot = (
      <Button type="button" variant="destructive" onClick={handleDelete}>
        {t('admin.user.delete')}
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:w-[680px] sm:max-w-[680px]"
        // Dismissing a warning/confirm dialog stacked on top of the sheet must not also close the
        // sheet: block the sheet's outside-click / Escape dismissal while an alert dialog is open.
        // Explicit closes (Cancel, X, submit, delete-confirm) go through onOpenChange and still work.
        onInteractOutside={e => {
          if (isAlertDialogOpen()) e.preventDefault();
        }}
        onEscapeKeyDown={e => {
          if (isAlertDialogOpen()) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="flex h-full flex-col overflow-hidden">
            <SheetHeader className="space-y-0 border-b px-6 py-4">
              <SheetTitle className="text-lg">
                {isEdit ? t('admin.user.edit_title') : t('admin.user.add_title')}
              </SheetTitle>
              {/* sr-only description satisfies the dialog a11y requirement; the visible identity block
                  and roles copy live in the sheet body below. */}
              <SheetDescription className="sr-only">
                {isEdit ? `${user!.firstName} ${user!.lastName}` : t('admin.user.add_title')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              {isEdit ? (
                // Identity row: avatar + name/email on the left, the promoted Administrator grant on
                // the right. items-center keeps the checkbox on the avatar's centre line.
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="2xl">
                      <AvatarFallback color="neutral" className="text-muted-foreground">
                        <User className="size-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold leading-tight text-foreground">
                        {user!.firstName} {user!.lastName}
                        {/* "(You)" matches the table cell + email: muted, text-sm, normal weight. */}
                        {isSelf && (
                          <span className="text-sm font-normal text-muted-foreground"> ({t('admin.users.you')})</span>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{user!.email}</span>
                    </div>
                  </div>
                  <AdminRoleToggle
                    role={ADMIN_ROLE}
                    checked={hasAdmin}
                    onToggle={toggleAdmin}
                    onViewPermissions={() => setPermissionsRole(ADMIN_ROLE)}
                    disabled={adminGrantLocked}
                    disabledReason={adminGrantLocked ? t('admin.user.err.self_admin') : undefined}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <h3 className="text-base font-semibold text-foreground">{t('admin.user.user_details')}</h3>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      schema={userFormSchema}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('admin.user.first_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} className={cn(fieldState.error && 'border-destructive')} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      schema={userFormSchema}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('admin.user.last_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} className={cn(fieldState.error && 'border-destructive')} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    schema={userFormSchema}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('admin.user.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className={cn(fieldState.error && 'border-destructive')} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Add has no avatar identity row, so the Administrator grant gets its own row here. */}
              {!isEdit && (
                <AdminRoleToggle
                  role={ADMIN_ROLE}
                  checked={hasAdmin}
                  onToggle={toggleAdmin}
                  onViewPermissions={() => setPermissionsRole(ADMIN_ROLE)}
                  disabled={adminGrantLocked}
                  disabledReason={adminGrantLocked ? t('admin.user.err.self_admin') : undefined}
                />
              )}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-foreground">{t('admin.user.assign_roles')}</h3>
                  <div className="flex flex-col gap-1">
                    {/* Baseline everyone gets (implicit `member` role) — dispels "no role = no access".
                        The link opens the same permissions dialog as the role boxes, for `member`. */}
                    <p className="text-sm text-muted-foreground">
                      {t('admin.user.baseline')} (
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 align-baseline text-sm"
                        onClick={() => setPermissionsRole(MEMBER_ROLE)}
                      >
                        {t('admin.user.baseline_link')}
                      </Button>
                      ).
                    </p>
                    <p className="text-sm text-muted-foreground">{t('admin.user.assign_roles_subtitle')}</p>
                  </div>
                </div>
                <RoleCheckboxGroup
                  value={assignments}
                  onChange={handleAssignmentsChange}
                  onViewPermissions={setPermissionsRole}
                  orgErrorRoleCodes={submitAttempted ? orgErrorRoleCodes : []}
                />
              </div>
            </div>

            <SheetFooter className="flex-row items-center justify-between border-t p-6 sm:justify-between">
              {deleteSlot}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('admin.user.cancel')}
                </Button>
                <Button type="submit">{isEdit ? t('admin.user.save') : t('admin.user.create')}</Button>
              </div>
            </SheetFooter>

            {/* Shared by the role boxes and the baseline line (opened for the implicit `member` role). */}
            <ViewPermissionsDialog
              role={permissionsRole}
              open={!!permissionsRole}
              onOpenChange={open => !open && setPermissionsRole(null)}
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
