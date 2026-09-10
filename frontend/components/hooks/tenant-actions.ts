import type { TenantMembership } from '../../api/api';

/**
 * The authorization action codes and the pure predicates over a membership. Kept free of React
 * and component imports so the root vitest config (environment: 'node', no aliases) can load it.
 * Consume it through the hooks in `use-tenant.tsx`.
 */

/**
 * Tenant-scoped actions granting access to the admin section.
 * Backend catalog: `internal/types/auth.go`
 */
export const TENANT_ACTIONS = {
  manageUser: 'can_manage_user',
  manageOrg: 'can_manage_org',
  manageRole: 'can_manage_role',
} as const;

/**
 * Org-scoped actions: held per organization, never tenant-wide. Deliberately separate from
 * TENANT_ACTIONS — these must not reach ADMIN_TENANT_ACTIONS, which gates the admin section.
 * Backend catalog: `internal/types/auth.go`
 */
export const ORG_ACTIONS = {
  editStatus: 'can_edit_status',
} as const;

/** Orgs where `action` applies. The API has already expanded a '*' grant to the tenant's orgs. */
export function orgsForAction(membership: TenantMembership | undefined, action: string): readonly string[] {
  return membership?.orgs_by_action?.[action] ?? [];
}

/**
 * Whether `action` applies at `org`. An absent `org` denies: callers resolve it from a loading
 * resource, and a permission gate must fail closed rather than fall back to "held anywhere".
 * Ask that question explicitly with `useOrgsForAction(...).length > 0`.
 */
export function hasOrgAction(
  membership: TenantMembership | undefined,
  action: string,
  org: string | undefined,
): boolean {
  return org ? orgsForAction(membership, action).includes(org) : false;
}
