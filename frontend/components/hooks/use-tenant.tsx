import { createContext, type ReactNode, useCallback, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

import type { TenantMembership, UserPreference } from '../../api/api';
import { authApi, userPreferenceApi } from '../../utils/api';
import Error403 from '../base/errors/403';
import { Spinner } from '../base/spinner';

export const TENANT_PREFERENCE_KEY = 'selected-tenant';

export type TenantContextValue = {
  tenant: string;
  tenants: TenantMembership[];
  setTenant: (code: string) => Promise<void>;
};

export const TenantContext = createContext<TenantContextValue>({
  tenant: '',
  tenants: [],
  setTenant: async () => {},
});

export function useTenant() {
  return useContext(TenantContext);
}

/** Prefixes an app path with the global route segments (today the tenant): localPath('/case') -> '/radiant/case'. */
export function useLocalPath() {
  const { tenant } = useTenant();
  return useCallback((path: string) => `/${tenant}${path === '/' ? '' : path}`, [tenant]);
}

/**
 * Tenant-scoped actions granting access to the admin section.
 */
export const TENANT_ACTIONS = {
  manageUser: 'can_manage_user',
  manageOrg: 'can_manage_org',
  manageRole: 'can_manage_role',
} as const;

const ADMIN_TENANT_ACTIONS = Object.values(TENANT_ACTIONS);

/** Tenant actions held by the caller in the currently selected tenant. */
export function useTenantActions(): readonly string[] {
  const { tenant, tenants } = useTenant();
  return tenants.find(membership => membership.code === tenant)?.tenant_actions ?? [];
}

/** True when the caller holds at least one of `actions` in the currently selected tenant. */
export function useHasAnyTenantAction(actions: readonly string[]) {
  const tenantActions = useTenantActions();
  return actions.some(action => tenantActions.includes(action));
}

/** True when the caller may reach the admin section of the currently selected tenant. */
export function useCanAdministerTenant() {
  return useHasAnyTenantAction(ADMIN_TENANT_ACTIONS);
}

/**
 * Org-scoped actions: granted per organization rather than tenant-wide.
 */
export const ORG_ACTIONS = {
  interpretVariant: 'can_interpret_variant',
  commentVariant: 'can_comment_variant',
  flagVariant: 'can_flag_variant',
} as const;

/** Org codes where the caller holds each org-scoped action, in the currently selected tenant. */
export function useOrgsByAction(): Record<string, string[]> {
  const { tenant, tenants } = useTenant();
  return tenants.find(membership => membership.code === tenant)?.orgs_by_action ?? {};
}

/**
 * True when the caller holds `action` at `orgCode`.
 */
export function useHasOrgAction(action: string, orgCode?: string) {
  const orgsByAction = useOrgsByAction();
  if (!orgCode) return false;
  return (orgsByAction[action] ?? []).includes(orgCode);
}

async function fetchTenants(): Promise<TenantMembership[]> {
  const response = await authApi.getMe();
  return response.data ?? [];
}

async function fetchTenantPreference(): Promise<UserPreference> {
  const response = await userPreferenceApi.getUserPreferences(TENANT_PREFERENCE_KEY);
  return response.data;
}

/** The tenant to fall back on when the URL does not name one: saved preference, else the first membership. */
export function usePreferredTenant() {
  const { data: tenants, isLoading: tenantsLoading } = useSWR('auth-me-tenants', fetchTenants, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // Returns 404 when the user never picked a tenant before -> treated as "no preference".
  const { data: preference, isLoading: preferenceLoading } = useSWR(
    `user-preference-${TENANT_PREFERENCE_KEY}`,
    fetchTenantPreference,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const tenant = useMemo(() => {
    if (!tenants?.length) return undefined;
    const preferredCode = (preference?.content as { tenant?: string } | undefined)?.tenant;
    if (preferredCode && tenants.some(m => m.code === preferredCode)) {
      return preferredCode;
    }
    return tenants[0].code;
  }, [tenants, preference]);

  return { tenant, tenants: tenants ?? [], isLoading: tenantsLoading || preferenceLoading };
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { tenant: tenantParam } = useParams<{ tenant: string }>();
  const { tenants, isLoading } = usePreferredTenant();

  // The URL owns the tenant. Following someone else's link never changes the saved preference:
  // only an explicit pick in the navbar switcher does.
  const tenant = tenantParam && tenants.some(m => m.code === tenantParam) ? tenantParam : undefined;

  const setTenant = async (code: string) => {
    await userPreferenceApi.postUserPreferences(TENANT_PREFERENCE_KEY, {
      key: TENANT_PREFERENCE_KEY,
      content: { tenant: code },
    });
    // Hard navigation: entity ids do not carry across tenants, so land on the case list.
    window.location.assign(`/${code}/case`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!tenant) {
    return <Error403 />;
  }

  return <TenantContext.Provider value={{ tenant, tenants, setTenant }}>{children}</TenantContext.Provider>;
}
