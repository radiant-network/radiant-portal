import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { CreateUserRole, RoleResult, UserResult } from '@/api/api';
import CheckboxGroupField, { type CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';
import { Input } from '@/components/base/shadcn/input';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useLoginContext } from '@/components/hooks/use-login';
import { TENANT_ACTIONS, useTenant } from '@/components/hooks/use-tenant';
import { usersApi } from '@/utils/api';

import RolePermissionsDialog from '../roles/role-permissions-dialog';
import { ScopeBadges } from '../roles/role-scope-badges';
import { ADMIN_ROLE_CODE, findRole, MEMBER_ROLE_CODE, needsOrganizations } from '../roles/roles-utils';
import { useMemberRole } from '../roles/use-member-role';
import { useTenantRoles } from '../roles/use-tenant-roles';

import RoleOrganizationsPicker, { NO_ORGANIZATIONS } from './role-organizations-picker';
import { useTenantAdminCount } from './use-tenant-admin-count';

function getAssignableRoles(roles: RoleResult[]) {
  return roles.filter(role => role.code !== ADMIN_ROLE_CODE);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildFormSchema(roles: RoleResult[], isEdit: boolean) {
  // Create and edit share one set of form values, so the identity keys must exist in both shapes.
  const identity = isEdit
    ? { first_name: z.string(), last_name: z.string(), email: z.string() }
    : {
        first_name: z.string().min(1, 'required'),
        last_name: z.string().min(1, 'required'),
        email: z.string().min(1, 'required').regex(EMAIL_PATTERN, 'invalid_email'),
      };

  return z
    .object({
      ...identity,
      roles: z.array(z.string()),
      organizations: z.record(z.string(), z.array(z.string())),
    })
    .superRefine((values, ctx) => {
      values.roles.forEach(roleCode => {
        const role = findRole(roles, roleCode);
        if (role && needsOrganizations(role) && (values.organizations[roleCode] ?? []).length === 0) {
          ctx.addIssue({ code: 'custom', message: 'organizations_required', path: ['organizations', roleCode] });
        }
      });
    });
}

type FormValues = z.infer<ReturnType<typeof buildFormSchema>>;

const EMPTY_FORM: FormValues = { first_name: '', last_name: '', email: '', roles: [], organizations: {} };

/**
 * To prefill Edit when it opens, and — once turned into a payload — as the reference
 * an unchanged submit is compared against.
 */
function toFormValues(user: UserResult): FormValues {
  const grantedRoles = user.roles.filter(role => role.role_code !== MEMBER_ROLE_CODE);

  return {
    ...EMPTY_FORM,
    roles: grantedRoles.map(role => role.role_code),
    organizations: Object.fromEntries(grantedRoles.map(role => [role.role_code, role.org_codes ?? []])),
  };
}

/**
 * Needed to manage alert closing without impact on sheet display
 */
const isAlertDialogOpen = () => !!document.querySelector('[role="alertdialog"]');

const CASES_PATH = '/case';
const ADMIN_ACTIONS: readonly string[] = Object.values(TENANT_ACTIONS);

/**
 * Whether the role set still grants access to the admin section. Read from the actions rather than
 * from the role codes: a custom role can carry an administrative action too.
 */
function keepsAdminAccess(roleCodes: string[], roles: RoleResult[]) {
  return roleCodes.some(code => findRole(roles, code)?.actions.some(action => ADMIN_ACTIONS.includes(action.code)));
}

/** Comparable form of a role set, so an unchanged edit can be detected. */
function serializeRoles(roles: CreateUserRole[]) {
  return roles
    .map(role => `${role.role_code}:${[...(role.org_codes ?? [])].sort().join(',')}`)
    .sort()
    .join('|');
}

type UserFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserResult;
  onSaved: () => void;
};

function UserFormSheet({ open, onOpenChange, user, onSaved }: UserFormSheetProps) {
  const { t } = useI18n();
  const { tenant, tenants } = useTenant();
  const { sub } = useLoginContext();

  const isEdit = !!user;
  const isSelf = user?.user_id === sub;
  const tenantName = tenants.find(membership => membership.code === tenant)?.name ?? tenant;

  const [permissionsRole, setPermissionsRole] = useState<RoleResult>();

  const { data: tenantRoles, isLoading: isLoadingRoles } = useTenantRoles(tenant);
  const { data: memberRole } = useMemberRole(tenant);
  const { data: adminCount } = useTenantAdminCount(tenant, open && isEdit);

  const isLastAdmin = adminCount === 1 && !!user?.roles.some(role => role.role_code === ADMIN_ROLE_CODE);

  const formSchema = useMemo(() => buildFormSchema(tenantRoles ?? [], isEdit), [tenantRoles, isEdit]);
  const assignableRoles = useMemo(() => getAssignableRoles(tenantRoles ?? []), [tenantRoles]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  const roles = form.watch('roles');
  const organizations = form.watch('organizations');
  const { isSubmitted } = form.formState;

  const hasAdminRole = roles.includes(ADMIN_ROLE_CODE);
  const isAdminGrantLocked = isSelf && !hasAdminRole;

  useEffect(() => {
    if (!open) return;
    form.reset(user ? toFormValues(user) : EMPTY_FORM);
  }, [open, user, form]);

  const organizationsErrors = form.formState.errors.organizations as Record<string, unknown> | undefined;

  const setRoles = (nextRoles: string[]) => {
    const keptOrganizations = Object.fromEntries(
      Object.entries(organizations).filter(([roleCode]) => nextRoles.includes(roleCode)),
    );
    form.setValue('roles', nextRoles);
    form.setValue('organizations', keptOrganizations, { shouldValidate: isSubmitted });
  };

  const getOrganizations = (roleCode: string) => organizations[roleCode] ?? NO_ORGANIZATIONS;

  const setOrganizations = (roleCode: string, orgCodes: string[]) =>
    form.setValue('organizations', { ...organizations, [roleCode]: orgCodes }, { shouldValidate: isSubmitted });

  const viewPermissionsLink = (role: RoleResult) => (
    <AnchorLink component="button" type="button" size="sm" external={false} onClick={() => setPermissionsRole(role)}>
      {t('admin.roles.view_permissions')}
    </AnchorLink>
  );

  const roleItems: CheckboxGroupFieldItem[] = assignableRoles.map(role => ({
    id: role.code,
    label: role.name,
    description: (
      <>
        {role.description} {viewPermissionsLink(role)}
      </>
    ),
    extraTitle: <ScopeBadges scope={role.scope} />,
    extraContent: needsOrganizations(role) ? (
      <RoleOrganizationsPicker
        value={getOrganizations(role.code)}
        onChange={orgCodes => setOrganizations(role.code, orgCodes)}
        invalid={!!organizationsErrors?.[role.code]}
      />
    ) : undefined,
  }));

  const memberName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  /** A network with no administrator can no longer be managed, so the change is vetoed outright. */
  const openLastAdminVeto = () =>
    alertDialog.open({
      type: 'warning',
      title: t('admin.users.errors.last_admin_update_title'),
      description: t('admin.users.errors.last_admin_update', { name: memberName, tenant: tenantName }),
      hideCancel: true,
      actionProps: { children: t('common.close') },
    });

  const openDeleteConfirm = () => {
    if (!user) return;

    alertDialog.open({
      type: 'error',
      title: t('admin.users.delete.title'),
      description: (
        <Trans
          i18nKey="admin.users.delete.body"
          values={{ name: memberName, tenant: tenantName }}
          components={{ b: <strong /> }}
        />
      ),
      cancelProps: { children: t('common.cancel') },
      actionProps: {
        variant: 'destructive',
        dataCy: 'delete-user-confirm',
        children: t('admin.users.delete.action'),
        onClick: async () => {
          try {
            await usersApi.deleteUser(tenant, user.user_id);
            toast.success(t('admin.users.delete.notifications.success'));
            onSaved();
            onOpenChange(false);
          } catch {
            toast.error(t('admin.users.delete.notifications.errors.default'));
          }
        },
      },
    });
  };

  /**
   * Removing your own access is the one removal no other administrator asked for, and the API
   * refuses it too. Wrapped in a span: a disabled button emits no event for the tooltip to catch.
   */
  const deleteButton = isSelf ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button type="button" variant="destructive" disabled className="pointer-events-none">
            {t('admin.users.delete.action')}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('admin.users.errors.self_delete')}</TooltipContent>
    </Tooltip>
  ) : (
    <Button type="button" variant="destructive" onClick={openDeleteConfirm}>
      {t('admin.users.delete.action')}
    </Button>
  );

  const adminBox = (
    <CheckboxGroupField
      box
      className={isEdit ? 'w-auto' : undefined}
      data={[{ id: ADMIN_ROLE_CODE, label: t('admin.users.roles.admin_access'), disabled: isAdminGrantLocked }]}
      value={roles.filter(code => code === ADMIN_ROLE_CODE)}
      onValueChange={values => {
        if (hasAdminRole && !values.includes(ADMIN_ROLE_CODE) && isLastAdmin) {
          openLastAdminVeto();
          return;
        }
        setRoles([...roles.filter(code => code !== ADMIN_ROLE_CODE), ...values]);
      }}
    />
  );

  const adminGrant = isAdminGrantLocked ? (
    <Tooltip>
      <TooltipTrigger asChild>{adminBox}</TooltipTrigger>
      <TooltipContent>{t('admin.users.roles.errors.self_admin')}</TooltipContent>
    </Tooltip>
  ) : (
    <HoverCard>
      <HoverCardTrigger asChild>{adminBox}</HoverCardTrigger>
      <HoverCardContent side="left" align="start" className="w-72">
        <p className="text-sm text-muted-foreground">
          <Trans
            i18nKey="admin.users.roles.admin_hint"
            components={{
              permissions: (
                <AnchorLink
                  component="button"
                  type="button"
                  size="sm"
                  external={false}
                  onClick={() => setPermissionsRole(findRole(tenantRoles ?? [], ADMIN_ROLE_CODE))}
                />
              ),
            }}
          />
        </p>
      </HoverCardContent>
    </HoverCard>
  );

  /**
   * TODO maybe additional back fix needed
   * Edit a mixed role to tenant role, if users have this role remove their orgs.
   * Front fix to remove the 'orgs' role from the user so the update no trigger error.
   */
  const toRolePayload = (values: FormValues): CreateUserRole[] =>
    values.roles
      .filter(code => code !== MEMBER_ROLE_CODE)
      .map(role_code => {
        const role = findRole(tenantRoles ?? [], role_code);
        const orgCodes = role && !needsOrganizations(role) ? [] : (values.organizations[role_code] ?? []);
        return orgCodes.length > 0 ? { role_code, org_codes: orgCodes } : { role_code };
      });

  const onSubmit = async (values: FormValues) => {
    const rolePayload = toRolePayload(values);

    if (user) {
      // An unchanged submit is a no-op: the sheet closes with no request and no toast.
      const currentRoles = toRolePayload(toFormValues(user));
      if (serializeRoles(rolePayload) === serializeRoles(currentRoles)) {
        onOpenChange(false);
        return;
      }
    }

    try {
      if (user) {
        // Identity is fixed at creation and read-only above, so an edit carries roles alone.
        await usersApi.updateUser(tenant, user.user_id, { roles: rolePayload });
      } else {
        await usersApi.createUser(tenant, {
          email: values.email.trim(),
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          roles: rolePayload,
        });
      }
      // Redirect if you remove your own admin role
      if (isSelf && tenantRoles && !keepsAdminAccess(values.roles, tenantRoles)) {
        window.location.assign(CASES_PATH);
        return;
      }

      toast.success(t(isEdit ? 'admin.users.edit.notifications.success' : 'admin.users.create.notifications.success'));
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        if (isEdit) {
          openLastAdminVeto();
        } else {
          form.setError('email', { message: 'user_email_exists' });
        }
        return;
      }
      toast.error(
        t(isEdit ? 'admin.users.edit.notifications.errors.default' : 'admin.users.create.notifications.errors.default'),
      );
    }
  };

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
          <SheetTitle>{t(isEdit ? 'admin.users.edit.title' : 'admin.users.create.title')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="xl">
                      <AvatarFallback color="neutral" className="text-muted-foreground">
                        <UserIcon className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">
                        {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                        {isSelf && (
                          <span className="text-sm font-normal text-muted-foreground">
                            {' '}
                            {t('admin.users.table.you')}
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  {adminGrant}
                </div>
              ) : (
                <section className="space-y-4">
                  <h3 className="text-base font-semibold">{t('admin.users.create.details_title')}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      schema={formSchema}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.users.fields.first_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      schema={formSchema}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.users.fields.last_name')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    schema={formSchema}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.users.fields.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {adminGrant}
                </section>
              )}
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">{t('admin.users.roles.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    <Trans
                      i18nKey="admin.users.roles.baseline"
                      components={{
                        permissions: (
                          <AnchorLink
                            component="button"
                            type="button"
                            size="sm"
                            external={false}
                            onClick={() => setPermissionsRole(memberRole)}
                          />
                        ),
                      }}
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">{t('admin.users.roles.subtitle')}</p>
                </div>
                {isLoadingRoles ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <CheckboxGroupField
                    box
                    className="gap-3"
                    data={roleItems}
                    value={roles.filter(code => code !== ADMIN_ROLE_CODE)}
                    onValueChange={values => setRoles([...roles.filter(code => code === ADMIN_ROLE_CODE), ...values])}
                  />
                )}
              </section>
            </div>
            <SheetFooter className="border-t p-6 flex-row items-center justify-between sm:justify-between">
              {isEdit ? deleteButton : <span />}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t(isEdit ? 'admin.users.edit.submit' : 'admin.users.create.submit')}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
        <RolePermissionsDialog role={permissionsRole} onOpenChange={() => setPermissionsRole(undefined)} />
      </SheetContent>
    </Sheet>
  );
}
export default UserFormSheet;
