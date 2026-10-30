/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Assignment Candidates - Paging', () => {
  const dataCandidates = data.assignmentCandidates;
  const path = `cases/${dataCandidates.case}/assignment_candidates`;

  it('First 3 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=3&offset=0`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 3);
    });
  });

  it('Second 3 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    let firstItemOfAll: any;

    cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=3&offset=0`, '', Auth.token)
      .then(firstRes => {
        firstItemOfAll = firstRes.body[0].user_id;
      })
      .then(() => {
        cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=3&offset=3`, '', Auth.token);
      })
      .then((secondRes: any) => {
        expect(secondRes.status).to.eq(200);
        cy.validateItemCount(secondRes, 3);
        expect(secondRes.body[0].user_id).to.not.eq(firstItemOfAll);
      });
  });

  it('Page index equals offset', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    let byOffset: any;

    cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=3&offset=3`, '', Auth.token)
      .then(offsetRes => {
        byOffset = offsetRes.body;
      })
      .then(() => {
        cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=3&page_index=1`, '', Auth.token); // an alternative to offset
      })
      .then((pageRes: any) => {
        expect(pageRes.status).to.eq(200);
        expect(pageRes.body).to.deep.equal(byOffset);
      });
  });

  it('No more items', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCallInTenant(dataCandidates.tenant, 'GET', `${path}?limit=1000000&page_index=100000`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0);
    });
  });
});
