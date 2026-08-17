/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Genes - Search - Unmatched', () => {
  const symbol = data.variantGermline.gene;
  const otherSymbol = data.cnvOverlappingGenes.gene;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "inputs": [
        "${symbol}",
        "${otherSymbol}",
        "unknownGene"
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
    const symbols = response.body.map((gene: { symbol: string }) => gene.symbol);
    expect(symbols, `symbol "${symbol}"`).to.include(symbol);
    expect(symbols, `symbol "${otherSymbol}"`).to.include(otherSymbol);
    expect(symbols, 'unmatched input is dropped from the results').to.not.include('unknownGene');
  });
});
