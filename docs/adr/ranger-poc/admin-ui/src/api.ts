const API_BASE = import.meta.env.PROD ? "/api" : "/api";

let token = "";

export function setToken(t: string) {
  token = t;
}

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface TenantRole {
  tenant_id: string;
  role_id: string;
}
export interface OrgRole {
  tenant_id: string;
  org_id: string;
  role_id: string;
}
export interface User {
  username: string;
  created_at: string;
  tenant_roles: TenantRole[] | null;
  org_roles: OrgRole[] | null;
}
export interface Role {
  role_id: string;
  role_name: string;
  scope: string;
  description?: string;
  actions: string[];
}
export interface Org {
  org_id: string;
  tenant_id: string;
  org_name: string;
}
export interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

// Auth endpoints
export const fetchMyTenants = () => api<string[]>("/auth/my-tenants");
export const fetchAdminTenants = () => api<string[]>("/admin/my-tenants");

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  mrn: string;
  date_of_birth: string;
  tenant_id: string;
  org_id: string;
  diagnosis: string;
}

export const fetchPatients = (tenant: string) =>
  api<{ data: Patient[] }>(`/${tenant}/patients`).then((r) => r.data || []);

// Tenant-scoped admin endpoints — all under /{tenant}/admin/...
export const fetchRoles = (tenant: string) => api<Role[]>(`/${tenant}/admin/roles`);

export const createRole = (tenant: string, role: { role_id: string; role_name: string; scope: string; description: string; actions: string[] }) =>
  api(`/${tenant}/admin/roles`, { method: "POST", body: JSON.stringify(role) });

export const updateRole = (tenant: string, role: { role_id: string; role_name: string; description: string; actions: string[] }) =>
  api(`/${tenant}/admin/roles`, { method: "PUT", body: JSON.stringify(role) });

export const deleteRole = (tenant: string, role_id: string) =>
  api(`/${tenant}/admin/roles`, { method: "DELETE", body: JSON.stringify({ role_id }) });
export const fetchActions = (tenant: string) =>
  api<{ action_id: string; scope: string; description: string }[]>(
    `/${tenant}/admin/actions`
  );
export const fetchUsers = (tenant: string) => api<User[]>(`/${tenant}/admin/users`);
export const fetchOrgs = (tenant: string) => api<Org[]>(`/${tenant}/admin/organizations`);
export const fetchMe = () =>
  api<{ user: string; tenant_roles: TenantRole[]; org_roles: OrgRole[] }>(
    "/auth/me"
  );

export const grantOrgRole = (
  tenant: string,
  username: string,
  org_id: string,
  role_id: string
) =>
  api(`/${tenant}/admin/grant-org-role`, {
    method: "POST",
    body: JSON.stringify({ username, org_id, role_id }),
  });

export const revokeOrgRole = (
  tenant: string,
  username: string,
  org_id: string,
  role_id: string
) =>
  api(`/${tenant}/admin/revoke-org-role`, {
    method: "POST",
    body: JSON.stringify({ username, org_id, role_id }),
  });

export const grantTenantRole = (
  tenant: string,
  username: string,
  role_id: string
) =>
  api(`/${tenant}/admin/grant-tenant-role`, {
    method: "POST",
    body: JSON.stringify({ username, role_id }),
  });

export const revokeTenantRole = (
  tenant: string,
  username: string,
  role_id: string
) =>
  api(`/${tenant}/admin/revoke-tenant-role`, {
    method: "POST",
    body: JSON.stringify({ username, role_id }),
  });
