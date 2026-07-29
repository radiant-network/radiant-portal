/**
 * Mock data model for the Admin UI prototype.
 *
 * The backend `can_manage_user/org/role` endpoints are still Incoming, and the generated
 * client (`frontend/api/`) has no "admin user record" type — `TenantMembership` only carries a
 * caller's *effective* actions per tenant, not identity/role/org rows. So we shape our own model
 * here, mirroring the real tables (`users` + `user_role` + `role` + `organization`). Swap this for
 * the generated types when the endpoints land.
 */

/** Scope of a permission (backend "action"): tenant-wide, or resolved per organization. */
export type ActionScope = 'tenant' | 'org';

/** An organization within a tenant. Codes are stored lowercase, displayed uppercase (CSS). */
export interface Organization {
  code: string;
  name: string;
}

/**
 * A permission = a backend "action". Shown as "Permissions" in the UI. Name + description are
 * i18n'd by code (`admin.permissions.<code>.{name,description}`); the `can_*` code is a system id.
 */
export interface Permission {
  code: string;
  scope: ActionScope;
}

/**
 * A role = a bundle of permissions. A role's scope is derived from its permissions: it needs an
 * org picker if it grants any org-scoped permission, and its badges show the scope(s) it covers.
 * Default roles are locked; custom roles are editable. Descriptions are i18n'd (`admin.roles.<code>.description`).
 */
export interface Role {
  /** System identifier, not translated (e.g. `tenant_admin`). */
  code: string;
  /** Display label (e.g. "Tenant Admin"). */
  label: string;
  /** Locked default role vs. custom role. */
  isDefault: boolean;
  /** Permission (action) codes this role grants. */
  permissions: string[];
}

/**
 * A role assignment on a user. For org-scoped roles, `orgCodes` lists the organizations the role
 * applies to (`['*']` = all orgs). Tenant-only roles omit `orgCodes`.
 *
 * The baseline `member` role is auto-granted to every user and is implicit — it is NOT stored in
 * `AdminUser.roles`. A user whose `roles` is empty holds only `member`.
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
