import { type RoleResult, RoleResultScopeEnum } from '@/api/api';

export const ADMIN_ROLE_CODE = 'tenant_admin';
export const BASELINE_ROLE_CODE = 'member';
export const MAX_ROLE_CODE_LENGTH = 50;
export const ROLE_CODE_PATTERN = /^[a-z][a-z0-9_]*$/;

export function findRole(roles: RoleResult[], code: string) {
  return roles.find(role => role.code === code);
}

/** Validation: role holding org-scoped actions when it is granted with no organization. */
export function needsOrganizations(role: RoleResult) {
  return role.scope !== RoleResultScopeEnum.Tenant;
}

/** Coerces free text to the code charset. */
export function toRoleCodeCharset(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, MAX_ROLE_CODE_LENGTH);
}

/** Code suggested from the name; unlike free typing it must also start with a letter. */
export function toRoleCode(name: string) {
  return toRoleCodeCharset(name)
    .replace(/^[^a-z]+/, '')
    .replace(/_+$/, '');
}
