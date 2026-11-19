/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';
import { setupOnce } from 'support/setupOnce';

// Every run writes the same state, with no cleanup: overlapping or stopped runs cannot leave the cases in another one.
describe('Cases - Search - Assignee', () => {
  const NOT_ASSIGNED = 'not-assign';
  const assignedCase = Number(data.caseSomatic.case);
  const unassignedCase = Number(data.case.case);
  let token: string;
  let updateStatus: number;
  let byAssignee: any;
  let assignedByNotAssigned: any;
  let unassignedByNotAssigned: any;

  const search = (assignees: string[], caseId: number) => {
    const criteria = [
      { field: 'assignee_id', value: assignees },
      { field: 'case_id', value: [String(caseId)] },
    ];
    return cy.apiCall('POST', 'cases/search', JSON.stringify({ search_criteria: criteria, limit: 20, page_index: 0 }), token);
  };

  const findCase = (caseId: number) => {
    const body = { search_criteria: [{ field: 'case_id', value: [String(caseId)] }] };
    return cy.apiCall('POST', 'cases/search', JSON.stringify(body), token).then(res => res.body.list[0]);
  };

  const assign = (caseId: number, userIds: string[]) => {
    return cy.apiCall('PUT', `cases/${caseId}/assignments`, JSON.stringify({ user_ids: userIds }), token);
  };

  setupOnce(() => {
    token = Cypress.expose('globalData').Authorization.token;
    assign(unassignedCase, []);
    // Keeps the current assignees, so overlapping runs write the same list.
    findCase(assignedCase).then(found => {
      cy.getUserId(token).then(userId => {
        const userIds = found.assignees?.length ? found.assignees.map((a: { user_id: string }) => a.user_id) : [userId];
        assign(assignedCase, userIds).then(res => {
          updateStatus = res.status;
        });
      });
    });
    // An assignee who lost access to the lab is dropped by the update: the retry then assigns the run's account.
    findCase(assignedCase).then(found => {
      expect(found.assignees, 'assignees of the assigned case').to.have.length.greaterThan(0);
      search([found.assignees[0].user_id], assignedCase).then(res => {
        byAssignee = res;
      });
    });
    search([NOT_ASSIGNED], assignedCase).then(res => {
      assignedByNotAssigned = res;
    });
    search([NOT_ASSIGNED], unassignedCase).then(res => {
      unassignedByNotAssigned = res;
    });
  });

  it('Update the assignees', () => {
    expect(updateStatus).to.eq(200);
  });

  it('Search by the assignee', () => {
    expect(byAssignee.status).to.eq(200);
    expect(byAssignee.body.count).to.eq(1);
    expect(byAssignee.body.list[0].case_id).to.eq(assignedCase);
  });

  it('Not assigned leaves the assigned case out', () => {
    expect(assignedByNotAssigned.status).to.eq(200);
    expect(assignedByNotAssigned.body.count).to.eq(0);
  });

  it('Not assigned finds the unassigned case', () => {
    expect(unassignedByNotAssigned.status).to.eq(200);
    expect(unassignedByNotAssigned.body.count).to.eq(1);
  });
});
