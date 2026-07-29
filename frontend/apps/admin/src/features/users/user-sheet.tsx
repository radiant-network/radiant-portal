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

import { MOCK_TENANT, roleIsOrgScoped, ROLES_BY_CODE } from '../../mock/data';
import type { AdminUser } from '../../mock/types';

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

  // Org-required: every checked org-scoped role must target ≥1 organization (or all).
  const orgError = assignments.some(a => {
    const role = ROLES_BY_CODE[a.roleCode];
    return role && roleIsOrgScoped(role) && a.orgCodes.length === 0;
  });

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

  const onSubmit = (values: UserFormValues) => {
    if (orgError) return;
    onSave(values, user?.id);
    onOpenChange(false);
  };

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col overflow-hidden">
            <SheetHeader className="space-y-0 border-b px-6 py-4">
              {isEdit ? (
                <div className="flex items-center gap-3">
                  <Avatar size="2xl">
                    <AvatarFallback color="neutral" className="text-muted-foreground">
                      <User className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <SheetTitle className="text-lg leading-tight">
                      {user!.firstName} {user!.lastName}
                      {/* "(You)" matches the table cell + the email below: muted, text-sm, normal weight. */}
                      {isSelf && (
                        <span className="text-sm font-normal text-muted-foreground"> ({t('admin.users.you')})</span>
                      )}
                    </SheetTitle>
                    <SheetDescription>{user!.email}</SheetDescription>
                  </div>
                </div>
              ) : (
                <>
                  <SheetTitle className="text-lg">{t('admin.user.add_title')}</SheetTitle>
                  {/* sr-only description satisfies the dialog a11y requirement (visible copy lives under "User roles"). */}
                  <SheetDescription className="sr-only">{t('admin.user.add_title')}</SheetDescription>
                </>
              )}
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              {!isEdit && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-foreground">{t('admin.user.user_details')}</h3>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      schema={userFormSchema}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('admin.user.first_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      schema={userFormSchema}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('admin.user.last_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    schema={userFormSchema}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.user.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">{t('admin.user.assign_roles')}</h3>
                  <p className="text-sm text-muted-foreground">{t('admin.user.assign_roles_subtitle')}</p>
                </div>
                <RoleCheckboxGroup
                  value={assignments}
                  onChange={handleAssignmentsChange}
                  lockGrantRoleCodes={isSelf ? { tenant_admin: t('admin.user.err.self_admin') } : undefined}
                />
              </div>
            </div>

            <SheetFooter className="flex-row items-center justify-between border-t p-6 sm:justify-between">
              {deleteSlot}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('admin.user.cancel')}
                </Button>
                <Button type="submit" disabled={orgError || (isEdit && !form.formState.isDirty)}>
                  {isEdit ? t('admin.user.save') : t('admin.user.create')}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
