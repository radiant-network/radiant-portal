/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Assignment Candidates - Org scoping', () => {
  const dataCandidates = data.assignmentCandidates;
  let responseCase: any;
  let responseOtherLab: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates`, '', Auth.token).then(res => {
      responseCase = res;
    });
    cy.apiCall('GET', `cases/${dataCandidates.case_other_lab}/assignment_candidates`, '', Auth.token).then(res => {
      responseOtherLab = res;
    });
  });

  it('Request status', () => {
    expect(responseCase.status).to.eq(200);
    expect(responseOtherLab.status).to.eq(200);
  });

  it('Eligible at the other lab only', () => {
    const emailsCase = responseCase.body.map((candidate: { email: string }) => candidate.email);
    const emailsOtherLab = responseOtherLab.body.map((candidate: { email: string }) => candidate.email);

    expect(emailsOtherLab, dataCandidates.diagnostic_lab_other).to.include(dataCandidates.other_lab_only.email);
    expect(emailsCase, dataCandidates.diagnostic_lab).to.not.include(dataCandidates.other_lab_only.email);
  });

  it('Eligible at both labs', () => {
    const emailsCase = responseCase.body.map((candidate: { email: string }) => candidate.email);
    const emailsOtherLab = responseOtherLab.body.map((candidate: { email: string }) => candidate.email);

    expect(emailsCase).to.include(dataCandidates.self.email);
    expect(emailsOtherLab).to.include(dataCandidates.self.email);
  });

  it('Search is scoped to the case lab', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const search = dataCandidates.other_lab_only.first_name;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates?search=${search}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0);
    });
  });
});
