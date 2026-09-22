/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Assignment Candidates - Search', () => {
  const dataCandidates = data.assignmentCandidates;

  it('Search by first name', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case_other_lab}/assignment_candidates?search=${dataCandidates.other_lab_only.first_name}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 1);
      expect(res.body[0].email).to.eq(dataCandidates.other_lab_only.email);
    });
  });

  it('Search by last name', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case_other_lab}/assignment_candidates?search=${dataCandidates.other_lab_only.last_name}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 1);
      expect(res.body[0].email).to.eq(dataCandidates.other_lab_only.email);
    });
  });

  it('Search by email', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates?search=${encodeURIComponent(dataCandidates.self.email)}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 1);
      expect(res.body[0].email).to.eq(dataCandidates.self.email);
    });
  });

  it('Search case insensitive', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates?search=${dataCandidates.accented.last_name.toUpperCase()}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 1);
      expect(res.body[0].email).to.eq(dataCandidates.accented.email);
    });
  });

  it('Search ignoring accents', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    [dataCandidates.accented.search_unaccented, dataCandidates.accented.search_accented].forEach(term => {
      cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates?search=${encodeURIComponent(term)}`, '', Auth.token).then(res => {
        expect(res.status, `search=${term}`).to.eq(200);
        cy.validateItemCount(res, 1);
        expect(res.body[0].email, `search=${term}`).to.eq(dataCandidates.accented.email);
      });
    });
  });

  it('Search with no result', () => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates?search=${dataCandidates.no_result}`, '', Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0);
    });
  });
});
