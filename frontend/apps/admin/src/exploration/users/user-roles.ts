import { type RoleResult, RoleResultScopeEnum } from '@/api/api';

export const ADMIN_ROLE_CODE = 'tenant_admin';
export const BASELINE_ROLE_CODE = 'member';

export function getAssignableRoles(roles: RoleResult[]) {
  return roles.filter(role => role.code !== ADMIN_ROLE_CODE && role.code !== BASELINE_ROLE_CODE);
}

export function findRole(roles: RoleResult[], code: string) {
  return roles.find(role => role.code === code);
}

/** Validation: role holding org-scoped actions when it is granted with no organization. */
export function needsOrganizations(role: RoleResult) {
  return role.scope !== RoleResultScopeEnum.Tenant;
}
