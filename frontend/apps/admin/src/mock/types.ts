/**
 * Mock data model for the Admin UI prototype.
 *
 * The backend `can_manage_users/orgs/roles` endpoints are still Incoming, and the generated
 * client (`frontend/api/`) has no "admin user record" type — `TenantMembership` only carries a
 * caller's *effective* actions per tenant, not identity/role/org rows. So we shape our own model
 * here, mirroring the real tables (`users` + `user_role` + `role` + `organization`). Swap this for
 * the generated types when the endpoints land.
 */

/** Scope of a role's actions: tenant-wide, or resolved per organization at assignment. */
export type RoleScope = 'tenant' | 'org';

/** An organization within a tenant. Codes are stored lowercase, displayed uppercase (CSS). */
export interface Organization {
  code: string;
  name: string;
}

/** A role = a bundle of actions. Default roles are locked; custom roles are duplicable/editable. */
export interface Role {
  /** System identifier, not translated (e.g. `tenant_admin`). */
  code: string;
  /** Display label (e.g. "Tenant Admin"). */
  label: string;
  scope: RoleScope;
  /** Locked default role vs. custom role. */
  isDefault: boolean;
}

/**
 * A role assignment on a user. For org-scoped roles, `orgCodes` lists the organizations the role
 * applies to (`['*']` = all orgs). Tenant-scoped roles omit `orgCodes`.
 *
 * The baseline `member` role is auto-granted to every user and is implicit — it is NOT stored in
 * `AdminUser.roles`. A user whose `roles` is empty holds only `member` (rendered as muted text).
 */
export interface AssignedRole {
  roleCode: string;
  orgCodes?: string[];
}

/**
 * A user in the tenant. Every listed user holds ≥1 role (mandatory `member` baseline) and is
 * Active — the only status in v1. Auth-but-no-access users (SSO auto-provisioned & never granted,
 * or access removed) don't appear here; they hit the 403 page. Offboarding = Delete (Edit sheet).
 */
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Explicit (non-baseline) role assignments. Empty = baseline `member` only. */
  roles: AssignedRole[];
  /** The signed-in user gets a "(You)" suffix. */
  isCurrentUser?: boolean;
}

export interface Tenant {
  code: string;
  /** Display name, uppercased in UI. */
  name: string;
}
