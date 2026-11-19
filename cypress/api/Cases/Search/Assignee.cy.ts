/// <reference types="cypress"/>
import { setupOnce } from 'support/setupOnce';

// The case is picked and assigned by the spec itself, so it does not depend on the tenant's data.
describe('Cases - Search - Assignee', () => {
  const NOT_ASSIGNED = 'not-assign';
  let token: string;
  let userId: string;
  let caseId: number;
  let assignStatus: number;
  let byUser: any;
  let byNotAssigned: any;

  const search = (assignees: string[], caseIds: number[] = []) => {
    const criteria = [{ field: 'assignee_id', value: assignees }];
    if (caseIds.length > 0) {
      criteria.push({ field: 'case_id', value: caseIds.map(String) });
    }
    return cy.apiCall('POST', 'cases/search', JSON.stringify({ search_criteria: criteria, limit: 20, page_index: 0 }), token);
  };

  const assign = (userIds: string[]) => {
    return cy.apiCall('PUT', `cases/${caseId}/assignments`, JSON.stringify({ user_ids: userIds }), token);
  };

  setupOnce(() => {
    token = Cypress.expose('globalData').Authorization.token;
    if (caseId) {
      // A retry starts over: free the case of the failed attempt.
      assign([]);
    }
    cy.getUserId(token).then(id => {
      userId = id;
    });

    search([NOT_ASSIGNED]).then(res => {
      expect(res.body.list, 'an unassigned case to work on').to.have.length.greaterThan(0);
      caseId = res.body.list[0].case_id;
      assign([userId]).then(assigned => {
        assignStatus = assigned.status;
      });
      search([userId], [caseId]).then(found => {
        byUser = found;
      });
      search([NOT_ASSIGNED], [caseId]).then(found => {
        byNotAssigned = found;
      });
    });
  });

  after(() => {
    if (caseId) {
      assign([]);
    }
  });

  it('Assign the case', () => {
    expect(assignStatus).to.eq(200);
  });

  it('Search by the assignee', () => {
    expect(byUser.status).to.eq(200);
    expect(byUser.body.count).to.eq(1);
    expect(byUser.body.list[0].case_id).to.eq(caseId);
  });

  it('Not assigned leaves the assigned case out', () => {
    expect(byNotAssigned.status).to.eq(200);
    expect(byNotAssigned.body.count).to.eq(0);
  });
});
