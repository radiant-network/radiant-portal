/// <reference types="cypress"/>
import { tableFacets } from 'pom/pages/CaseEntity_Variants_SNV_Facets';

describe('Occurrences - Germline - SNV - Count - Variant', () => {
  let response: any;
  let Auth: any;
  let seq_id: string;
  let globalData: any;

  before(() => {
    globalData = Cypress.env('globalData');
    Auth = globalData.Authorization;
    seq_id = globalData.Count.seq_id;
  });

  const sectionData = tableFacets.find(s => s.section === 'Variant');

  if (!sectionData) {
    throw new Error(`Section "Variant" not found in tableFacets`);
  }

  sectionData.facets.forEach(facet => {
    it(`${facet.name}`, () => {
      const facetData = globalData.Count.Variant.find((f: { field: string }) => f.field === facet.apiField);

      if (!facetData) {
        throw new Error(`Facet data for "${facet.apiField}" not found in globalData.Count.Variant`);
      }

      cy.fixture('RequestBody/ApplyFacet.json').then(fixture => {
        const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD', facet.apiField).replace('_VALUE', facetData.value).replace('_OP', facetData.op));

        cy.apiCall('POST', `occurrences/germline/snv/${seq_id}/count`, body, Auth.token).then(res => {
          response = res;
          expect(response.status).to.eq(200);
          expect(response.body.count).to.eq(facetData.count);
        });
      });
    });
  });
});
