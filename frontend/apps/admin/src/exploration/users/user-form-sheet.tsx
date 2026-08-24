import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import type { RoleResult } from '@/api/api';
import CheckboxGroupField, { type CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { usersApi } from '@/utils/api';

import RoleOrganizationsPicker, { NO_ORGANIZATIONS } from './role-organizations-picker';
import RolePermissionsDialog from './role-permissions-dialog';
import { ScopeBadges } from './role-scope-badges';
import { useTenantRoles } from './use-tenant-roles';
import { ADMIN_ROLE_CODE, BASELINE_ROLE_CODE, findRole, getAssignableRoles, needsOrganizations } from './user-roles';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildFormSchema(roles: RoleResult[]) {
  return z
    .object({
      first_name: z.string().min(1, 'required'),
      last_name: z.string().min(1, 'required'),
      email: z.string().min(1, 'required').regex(EMAIL_PATTERN, 'invalid_email'),
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

type UserFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

function UserFormSheet({ open, onOpenChange, onSaved }: UserFormSheetProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();

  const [permissionsRole, setPermissionsRole] = useState<RoleResult>();

  const { data: tenantRoles, isLoading: isLoadingRoles } = useTenantRoles(tenant);

  const formSchema = useMemo(() => buildFormSchema(tenantRoles ?? []), [tenantRoles]);
  const assignableRoles = useMemo(() => getAssignableRoles(tenantRoles ?? []), [tenantRoles]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  const roles = form.watch('roles');
  const organizations = form.watch('organizations');
  const { isSubmitted } = form.formState;

  useEffect(() => {
    if (!open) return;
    form.reset(EMPTY_FORM);
  }, [open, form]);

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
      {t('admin.users.roles.view_permissions')}
    </AnchorLink>
  );

  const adminItem: CheckboxGroupFieldItem[] = [{ id: ADMIN_ROLE_CODE, label: t('admin.users.roles.admin_access') }];

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

  const onSubmit = async (values: FormValues) => {
    try {
      await usersApi.createUser(tenant, {
        email: values.email.trim(),
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        roles: values.roles
          .filter(code => code !== BASELINE_ROLE_CODE)
          .map(role_code => {
            const orgCodes = values.organizations[role_code] ?? [];
            return orgCodes.length > 0 ? { role_code, org_codes: orgCodes } : { role_code };
          }),
      });
      toast.success(t('admin.users.create.notifications.success'));
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        form.setError('email', { message: 'user_email_exists' });
        return;
      }
      toast.error(t('admin.users.create.notifications.errors.default'));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 max-sm:w-full sm:max-w-[680px]">
        <SheetHeader className="border-b p-6">
          <SheetTitle>{t('admin.users.create.title')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
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
                <CheckboxGroupField
                  box
                  data={adminItem}
                  value={roles.filter(code => code === ADMIN_ROLE_CODE)}
                  onValueChange={values => setRoles([...roles.filter(code => code !== ADMIN_ROLE_CODE), ...values])}
                />
              </section>
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
                            onClick={() => setPermissionsRole(findRole(tenantRoles ?? [], BASELINE_ROLE_CODE))}
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
            <SheetFooter className="border-t p-6 flex-row justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t('admin.users.create.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
        <RolePermissionsDialog role={permissionsRole} onOpenChange={() => setPermissionsRole(undefined)} />
      </SheetContent>
    </Sheet>
  );
}
export default UserFormSheet;
