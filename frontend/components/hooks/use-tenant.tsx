import { createContext, type ReactNode, useContext, useMemo } from 'react';
import useSWR from 'swr';

import type { TenantMembership, UserPreference } from '../../api/api';
import { authApi, userPreferenceApi } from '../../utils/api';
import Error403 from '../base/errors/403';
import { Spinner } from '../base/spinner';

import { hasOrgAction, orgsForAction, TENANT_ACTIONS } from './tenant-actions';

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

export { ORG_ACTIONS, TENANT_ACTIONS } from './tenant-actions';

const ADMIN_TENANT_ACTIONS = Object.values(TENANT_ACTIONS);

/** The caller's membership in the currently selected tenant, if any. */
function useCurrentMembership(): TenantMembership | undefined {
  const { tenant, tenants } = useTenant();
  return tenants.find(membership => membership.code === tenant);
}

/** Tenant actions held by the caller in the currently selected tenant. */
export function useTenantActions(): readonly string[] {
  return useCurrentMembership()?.tenant_actions ?? [];
}

/** Orgs of the currently selected tenant where the caller holds `action`. */
export function useOrgsForAction(action: string): readonly string[] {
  return orgsForAction(useCurrentMembership(), action);
}

/** True when the caller holds the org-scoped `action` at `org` in the currently selected tenant. */
export function useHasOrgAction(action: string, org: string | undefined): boolean {
  return hasOrgAction(useCurrentMembership(), action, org);
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

async function fetchTenants(): Promise<TenantMembership[]> {
  const response = await authApi.getMe();
  return response.data ?? [];
}

async function fetchTenantPreference(): Promise<UserPreference> {
  const response = await userPreferenceApi.getUserPreferences(TENANT_PREFERENCE_KEY);
  return response.data;
}

export function TenantProvider({ children }: { children: ReactNode }) {
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

  const setTenant = async (code: string) => {
    await userPreferenceApi.postUserPreferences(TENANT_PREFERENCE_KEY, {
      key: TENANT_PREFERENCE_KEY,
      content: { tenant: code },
    });
    // Hard navigation to /case: the provider re-reads the preference and every
    // request picks up the new tenant.
    window.location.assign('/case');
  };

  if (tenantsLoading || preferenceLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!tenant) {
    return <Error403 />;
  }

  return (
    <TenantContext.Provider value={{ tenant, tenants: tenants ?? [], setTenant }}>{children}</TenantContext.Provider>
  );
}
