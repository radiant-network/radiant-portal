/// <reference types="cypress"/>

describe('Documents - Search - Sort', () => {
  it('Sort by size ascending', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "sort": [
        {
          "field": "size",
          "order": "asc"
        }
      ],
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', 'documents/search', body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      const sizes = res.body.list.map((document: { size: number }) => document.size);
      expect(sizes).to.deep.equal([...sizes].sort((a: number, b: number) => a - b));
    });
  });

  it('Sort by size descending', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "sort": [
        {
          "field": "size",
          "order": "desc"
        }
      ],
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', 'documents/search', body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      const sizes = res.body.list.map((document: { size: number }) => document.size);
      expect(sizes).to.deep.equal([...sizes].sort((a: number, b: number) => b - a));
    });
  });
});
