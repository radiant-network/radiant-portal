/// <reference types="cypress"/>

describe('Documents - Download URL - Content', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 1,
      "page_index": 0
    }`;

    cy.apiCall('POST', 'documents/search', body, Auth.token)
      .then(searchRes => {
        const documentId = searchRes.body.list[0].document_id;
        return cy.apiCall('GET', `documents/${documentId}/download_url`, '', Auth.token);
      })
      .then((res: any) => {
        response = res;
      });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.url).to.be.a('string').and.not.be.empty;
    expect(response.body.expires_at).to.be.a('number').and.to.be.greaterThan(0);
  });
});
