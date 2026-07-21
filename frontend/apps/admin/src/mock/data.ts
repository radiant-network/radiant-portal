import type { AdminUser, Organization, Role, Tenant } from './types';

/**
 * Seed data for the Admin UI prototype. Illustrative only — not wired to the backend.
 * Codes are stored lowercase (displayed uppercase via CSS). Roles use canonical codes plus one
 * example custom role (`clinical_reviewer`) to show org-scoped chips.
 */

export const MOCK_TENANT: Tenant = { code: 'cbtn', name: 'CBTN' };

export const MOCK_ORGS: Organization[] = [
  { code: 'chop', name: 'Children’s Hospital of Philadelphia' },
  { code: 'ucsf', name: 'University of California, San Francisco' },
  { code: 'bch', name: 'Boston Children’s Hospital' },
];

export const MOCK_ROLES: Role[] = [
  { code: 'tenant_admin', label: 'Tenant Admin', scope: 'tenant', isDefault: true },
  { code: 'member', label: 'Member', scope: 'tenant', isDefault: true },
  { code: 'geneticist', label: 'Geneticist', scope: 'org', isDefault: true },
  { code: 'data_manager', label: 'Data Manager', scope: 'org', isDefault: true },
  // Example custom role (bundle of org-scoped actions).
  { code: 'clinical_reviewer', label: 'Clinical Reviewer', scope: 'org', isDefault: false },
];

/** Lookup maps for cell rendering / filters. */
export const ROLES_BY_CODE: Record<string, Role> = Object.fromEntries(MOCK_ROLES.map(r => [r.code, r]));
export const ORGS_BY_CODE: Record<string, Organization> = Object.fromEntries(MOCK_ORGS.map(o => [o.code, o]));

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@chop.edu',
    status: 'active',
    isCurrentUser: true,
    roles: [{ roleCode: 'tenant_admin' }, { roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  {
    id: 'u-002',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael.rodriguez@chop.edu',
    status: 'active',
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
    status: 'active',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  { id: 'u-004', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@chop.edu', status: 'active', roles: [] },
  { id: 'u-005', firstName: 'Emily', lastName: 'Nguyen', email: 'emily.nguyen@chop.edu', status: 'active', roles: [] },
  { id: 'u-006', firstName: 'David', lastName: 'Okafor', email: 'david.okafor@chop.edu', status: 'active', roles: [] },
  {
    id: 'u-007',
    firstName: 'Rachel',
    lastName: 'Goldberg',
    email: 'rachel.goldberg@chop.edu',
    status: 'active',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['ucsf'] }],
  },
  {
    id: 'u-008',
    firstName: 'Thomas',
    lastName: 'Muller',
    email: 'thomas.muller@chop.edu',
    status: 'active',
    roles: [],
  },
  {
    id: 'u-009',
    firstName: 'Aisha',
    lastName: 'Hassan',
    email: 'aisha.hassan@chop.edu',
    status: 'active',
    roles: [{ roleCode: 'clinical_reviewer', orgCodes: ['chop', 'ucsf'] }],
  },
  { id: 'u-010', firstName: 'Daniel', lastName: 'Kim', email: 'daniel.kim@chop.edu', status: 'active', roles: [] },
  {
    id: 'u-011',
    firstName: 'Laura',
    lastName: 'Bianchi',
    email: 'laura.bianchi@chop.edu',
    status: 'active',
    roles: [],
  },
  {
    id: 'u-012',
    firstName: 'Omar',
    lastName: 'Haddad',
    email: 'omar.haddad@chop.edu',
    status: 'active',
    roles: [{ roleCode: 'geneticist', orgCodes: ['chop'] }],
  },
  {
    id: 'u-013',
    firstName: 'Sofia',
    lastName: 'Rossi',
    email: 'sofia.rossi@chop.edu',
    status: 'active',
    roles: [{ roleCode: 'data_manager', orgCodes: ['ucsf'] }],
  },
  {
    id: 'u-014',
    firstName: 'Kevin',
    lastName: 'Zhang',
    email: 'kevin.zhang@chop.edu',
    status: 'active',
    roles: [
      { roleCode: 'geneticist', orgCodes: ['bch'] },
      { roleCode: 'clinical_reviewer', orgCodes: ['bch'] },
    ],
  },
  // Inactive: SSO auto-provisioned on first sign-in, not yet granted a role.
  {
    id: 'u-101',
    firstName: 'Robert',
    lastName: 'Fisher',
    email: 'robert.fisher@chop.edu',
    status: 'inactive',
    roles: [],
  },
  { id: 'u-102', firstName: 'Nina', lastName: 'Petrov', email: 'nina.petrov@chop.edu', status: 'inactive', roles: [] },
  {
    id: 'u-103',
    firstName: 'Ahmed',
    lastName: 'Al-Sayed',
    email: 'ahmed.alsayed@chop.edu',
    status: 'inactive',
    roles: [],
  },
  { id: 'u-104', firstName: 'Grace', lastName: 'Park', email: 'grace.park@chop.edu', status: 'inactive', roles: [] },
  {
    id: 'u-105',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'lucas.moreau@chop.edu',
    status: 'inactive',
    roles: [],
  },
  { id: 'u-106', firstName: 'Hannah', lastName: 'Berg', email: 'hannah.berg@chop.edu', status: 'inactive', roles: [] },
];
