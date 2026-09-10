import { describe, expect, it } from 'vitest';

import type { TenantMembership } from '../../api/api';

import { hasOrgAction, ORG_ACTIONS, orgsForAction, TENANT_ACTIONS } from './tenant-actions';

const GENETICIST: TenantMembership = {
  code: 'radiant',
  name: 'Radiant',
  tenant_actions: ['can_search_case', 'can_view_kb'],
  orgs_by_action: {
    can_edit_case: ['CHOP', 'CHUSJ'],
    can_read_pii: ['CHOP', 'CHUSJ'],
  },
};

describe('orgsForAction', () => {
  it('returns the orgs where the action applies', () => {
    expect(orgsForAction(GENETICIST, ORG_ACTIONS.editCase)).toEqual(['CHOP', 'CHUSJ']);
  });

  it('returns empty for an action the membership does not carry', () => {
    expect(orgsForAction(GENETICIST, 'can_ingest_data')).toEqual([]);
  });

  it('returns empty when the tenant has no membership yet', () => {
    expect(orgsForAction(undefined, ORG_ACTIONS.editCase)).toEqual([]);
  });

  it('returns empty when the membership carries no org grants at all', () => {
    expect(orgsForAction({ code: 'radiant' }, ORG_ACTIONS.editCase)).toEqual([]);
  });
});

describe('hasOrgAction', () => {
  it('grants at an org listed for the action', () => {
    expect(hasOrgAction(GENETICIST, ORG_ACTIONS.editCase, 'CHOP')).toBe(true);
  });

  it('denies at an org the action does not cover', () => {
    expect(hasOrgAction(GENETICIST, ORG_ACTIONS.editCase, 'CQGC')).toBe(false);
  });

  it('denies an action the membership does not carry, even at a granted org', () => {
    expect(hasOrgAction(GENETICIST, 'can_ingest_data', 'CHOP')).toBe(false);
  });

  // Fails closed: the org is resolved from a case that may still be loading, so an absent org
  // must never degrade into "holds it somewhere".
  it('denies when the org is not resolved yet', () => {
    expect(hasOrgAction(GENETICIST, ORG_ACTIONS.editCase, undefined)).toBe(false);
  });

  it('denies when the tenant has no membership yet', () => {
    expect(hasOrgAction(undefined, ORG_ACTIONS.editCase, 'CHOP')).toBe(false);
  });
});

// can_edit_case is org-scoped, so it must stay out of the map that gates the admin section.
describe('action catalogs', () => {
  it('keeps org-scoped actions out of TENANT_ACTIONS', () => {
    expect(Object.values(TENANT_ACTIONS)).not.toContain(ORG_ACTIONS.editCase);
  });
});
