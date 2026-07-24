import type { ActionScope, AdminUser, Organization, Permission, Role, Tenant } from './types';

/**
 * Seed data for the Admin UI prototype. Illustrative only — not wired to the backend.
 * Codes are stored lowercase (displayed uppercase via CSS). Every user is Active and holds ≥1 role
 * (mandatory `member`, implicit). Role/permission names + descriptions are i18n'd; see
 * `admin.roles.<code>.description` and `admin.permissions.<code>.{name,description}`.
 */

export const MOCK_TENANT: Tenant = { code: 'cbtn', name: 'CBTN' };

export const MOCK_ORGS: Organization[] = [
  { code: 'chop', name: 'Children’s Hospital of Philadelphia' },
  { code: 'clev', name: 'Cleveland Clinic' },
  { code: 'bch', name: 'Boston Children’s Hospital' },
  { code: 'mayo', name: 'Mayo Clinic' },
  { code: 'ucsf', name: 'University of California, San Francisco' },
];

/** Permission (action) catalog with scope. Names/descriptions live in i18n, keyed by code. */
export const PERMISSIONS: Permission[] = [
  { code: 'can_manage_users', scope: 'tenant' },
  { code: 'can_manage_orgs', scope: 'tenant' },
  { code: 'can_manage_roles', scope: 'tenant' },
  { code: 'can_search_case', scope: 'tenant' },
  { code: 'can_view_kb', scope: 'tenant' },
  { code: 'can_read_pii', scope: 'org' },
  { code: 'can_interpret_variant', scope: 'org' },
  { code: 'can_comment_variant', scope: 'org' },
  { code: 'can_flag_variant', scope: 'org' },
  { code: 'can_download_file', scope: 'org' },
  { code: 'can_ingest_data', scope: 'org' },
];

export const PERMISSIONS_BY_CODE: Record<string, Permission> = Object.fromEntries(PERMISSIONS.map(p => [p.code, p]));

export const MOCK_ROLES: Role[] = [
  {
    code: 'tenant_admin',
    label: 'Tenant Admin',
    isDefault: true,
    permissions: ['can_manage_users', 'can_manage_orgs', 'can_manage_roles'],
  },
  { code: 'member', label: 'Member', isDefault: true, permissions: ['can_search_case', 'can_view_kb'] },
  {
    code: 'geneticist',
    label: 'Geneticist',
    isDefault: true,
    permissions: [
      'can_read_pii',
      'can_interpret_variant',
      'can_comment_variant',
      'can_flag_variant',
      'can_download_file',
    ],
  },
  { code: 'data_manager', label: 'Data Manager', isDefault: true, permissions: ['can_ingest_data'] },
  // Custom roles (editable in a real tenant). Clinical Reviewer mixes tenant + org scope.
  {
    code: 'clinical_reviewer',
    label: 'Clinical Reviewer',
    isDefault: false,
    permissions: ['can_view_kb', 'can_interpret_variant', 'can_comment_variant'],
  },
  { code: 'org_manager', label: 'Org Manager', isDefault: false, permissions: ['can_manage_orgs'] },
];

/** Lookup maps for cell rendering / filters. */
export const ROLES_BY_CODE: Record<string, Role> = Object.fromEntries(MOCK_ROLES.map(r => [r.code, r]));
export const ORGS_BY_CODE: Record<string, Organization> = Object.fromEntries(MOCK_ORGS.map(o => [o.code, o]));

/** The roles the admin can assign in the sheet — everything except the implicit baseline `member`. */
export const ASSIGNABLE_ROLES: Role[] = MOCK_ROLES.filter(r => r.code !== 'member');

/** Distinct scopes a role covers (tenant first), derived from its permissions — drives scope badges. */
export function getRoleScopes(role: Role): ActionScope[] {
  const scopes = new Set(role.permissions.map(code => PERMISSIONS_BY_CODE[code]?.scope).filter(Boolean));
  return (['tenant', 'org'] as ActionScope[]).filter(s => scopes.has(s));
}

/** True if the role grants any org-scoped permission → needs an org picker at assignment. */
export function roleIsOrgScoped(role: Role): boolean {
  return role.permissions.some(code => PERMISSIONS_BY_CODE[code]?.scope === 'org');
}

/** Badge variant per scope, matching Figma: Tenant = cyan (`badge/cyan`), Organization = violet (`badge/violet`). */
export const SCOPE_BADGE_VARIANT: Record<ActionScope, 'cyan' | 'violet'> = {
  tenant: 'cyan',
  org: 'violet',
};

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@chop.edu',
    isCurrentUser: true,
    roles: [{ roleCode: 'tenant_admin' }, { roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  {
    id: 'u-002',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael.rodriguez@chop.edu',
    roles: [
      { roleCode: 'data_manager', orgCodes: ['chop'] },
      { roleCode: 'clinical_reviewer', orgCodes: ['chop'] },
    ],
  },
  {
    id: 'u-003',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@chop.edu',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  { id: 'u-004', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@chop.edu', roles: [] },
  { id: 'u-005', firstName: 'Emily', lastName: 'Nguyen', email: 'emily.nguyen@chop.edu', roles: [] },
  {
    id: 'u-006',
    firstName: 'David',
    lastName: 'Okafor',
    email: 'david.okafor@chop.edu',
    roles: [{ roleCode: 'org_manager' }],
  },
  {
    id: 'u-007',
    firstName: 'Rachel',
    lastName: 'Goldberg',
    email: 'rachel.goldberg@chop.edu',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['ucsf'] }],
  },
  { id: 'u-008', firstName: 'Thomas', lastName: 'Muller', email: 'thomas.muller@chop.edu', roles: [] },
  {
    id: 'u-009',
    firstName: 'Aisha',
    lastName: 'Hassan',
    email: 'aisha.hassan@chop.edu',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  { id: 'u-010', firstName: 'Daniel', lastName: 'Kim', email: 'daniel.kim@chop.edu', roles: [] },
  { id: 'u-011', firstName: 'Laura', lastName: 'Bianchi', email: 'laura.bianchi@chop.edu', roles: [] },
  {
    id: 'u-012',
    firstName: 'Omar',
    lastName: 'Haddad',
    email: 'omar.haddad@chop.edu',
    roles: [{ roleCode: 'geneticist', orgCodes: ['chop'] }],
  },
  {
    id: 'u-013',
    firstName: 'Sofia',
    lastName: 'Rossi',
    email: 'sofia.rossi@chop.edu',
    roles: [{ roleCode: 'data_manager', orgCodes: ['ucsf'] }],
  },
  {
    id: 'u-014',
    firstName: 'Kevin',
    lastName: 'Zhang',
    email: 'kevin.zhang@chop.edu',
    roles: [
      { roleCode: 'geneticist', orgCodes: ['bch'] },
      { roleCode: 'clinical_reviewer', orgCodes: ['bch'] },
    ],
  },
];
