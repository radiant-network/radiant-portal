/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Genes - Autocomplete - Ensembl ID', () => {
  const symbol = data.variantGermline.gene;
  const geneId = data.variantGermline.gene_id;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `genes/autocomplete?prefix=${geneId.toLowerCase()}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    const gene = response.body.find((item: { source: { id: string } }) => item.source.id === geneId);
    expect(gene, `gene "${geneId}"`).to.exist;
    expect(gene.source.name).to.eq(symbol);
  });
});
