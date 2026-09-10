import type { TenantMembership } from '../../api/api';

export const TENANT_ACTIONS = {
  manageUser: 'can_manage_user',
  manageOrg: 'can_manage_org',
  manageRole: 'can_manage_role',
} as const;

export const ORG_ACTIONS = {
  editCase: 'can_edit_case',
} as const;

export function orgsForAction(membership: TenantMembership | undefined, action: string): readonly string[] {
  return membership?.orgs_by_action?.[action] ?? [];
}

export function hasOrgAction(
  membership: TenantMembership | undefined,
  action: string,
  org: string | undefined,
): boolean {
  return org ? orgsForAction(membership, action).includes(org) : false;
}
