/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Genes - Search - Symbol', () => {
  const symbol = data.variantGermline.gene;
  const geneId = data.variantGermline.gene_id;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "inputs": [
        "${symbol.toLowerCase()}"
      ]
    }`;

    cy.apiCall('POST', 'genes/search', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    cy.validateItemCount(response, 1);
    expect(response.body[0]).to.deep.eq({ ensembl_gene_id: geneId, symbol: symbol });
  });
});
