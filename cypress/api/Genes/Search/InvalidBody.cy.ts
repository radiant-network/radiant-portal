/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Genes - Search - Invalid Body', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "inputs": "notAnArray"
    }`;

    cy.apiCall('POST', 'genes/search', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(400);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('status', 'message');
    expect(response.body).to.include({
      message: apiMessages.UnmarshalStringTo('GeneSearchBody.inputs', '[]string'),
    });
  });
});
