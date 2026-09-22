/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Assignment Candidates - Result', () => {
  const dataCandidates = data.assignmentCandidates;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${dataCandidates.case}/assignment_candidates`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body).to.be.an('array').and.not.be.empty;
    response.body.forEach((candidate: any) => {
      expect(candidate).to.have.all.keys('user_id', 'first_name', 'last_name', 'email');
    });
  });

  it('Eligible user', () => {
    const self = response.body.find((candidate: { email: string }) => candidate.email === dataCandidates.self.email);

    expect(self, `candidate ${dataCandidates.self.email}`).to.exist;
    expect(self).to.include({
      first_name: dataCandidates.self.first_name,
      last_name: dataCandidates.self.last_name,
    });
  });

  it('No duplicate user', () => {
    const userIds = response.body.map((candidate: { user_id: string }) => candidate.user_id);

    expect(userIds).to.deep.equal([...new Set(userIds)]);
  });

  it('Sorted by last name then first name', () => {
    const names = response.body.map((candidate: { last_name: string; first_name: string }) => [candidate.last_name, candidate.first_name]);

    expect(names).to.deep.equal([...names].sort((a: string[], b: string[]) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])));
  });
});
