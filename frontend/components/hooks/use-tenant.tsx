import { createContext, type ReactNode, useContext, useMemo } from 'react';
import useSWR from 'swr';

import type { TenantMembership, UserPreference } from '../../api/api';
import { authApi, userPreferenceApi } from '../../utils/api';
import EmptyTenant from '../base/empties/empty_tenant';
import { Spinner } from '../base/spinner';

export const TENANT_PREFERENCE_KEY = 'selected-tenant';

export type TenantContextValue = {
  /** Active tenant code (always defined once children render). */
  tenant: string;
  /** All tenants the user belongs to (from /auth/me). */
  tenants: TenantMembership[];
  /** Persist the chosen tenant then hard-reload onto /case so every request uses it. */
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
    // request picks up the new tenant. Keeps us clear of a global SWR cache mutate.
    window.location.assign('/case');
  };

  if (tenantsLoading || preferenceLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  // Empty state: the user belongs to no tenant.
  if (!tenant) {
    return <EmptyTenant />;
  }

  return (
    <TenantContext.Provider value={{ tenant, tenants: tenants ?? [], setTenant }}>{children}</TenantContext.Provider>
  );
}
