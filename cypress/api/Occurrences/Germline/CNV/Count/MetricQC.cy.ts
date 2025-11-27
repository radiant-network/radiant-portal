/// <reference types="cypress"/>
import { tableFacets } from 'pom/pages/CaseEntity_Variants_CNV_Facets';

describe('Occurrences - Germline - CNV - Count - Metric QC', () => {
  let response: any;
  let Auth: any;
  let seq_id: string;
  let globalData: any;

  before(() => {
    globalData = Cypress.env('globalData');
    Auth = globalData.Authorization;
    seq_id = globalData.Count.seq_id;
  });

  const sectionData = tableFacets.find(s => s.section === 'Metric QC');

  if (!sectionData) {
    throw new Error(`Section "Metric QC" not found in tableFacets`);
  }

  sectionData.facets.forEach(facet => {
    const facetName = facet.name instanceof RegExp ? facet.name.source.replace(/^\^|\$$/g, '') : facet.name;

    it(`${facetName}`, () => {
      const facetData = globalData.Count.cnv[sectionData.section].find((f: { field: string }) => f.field === facet.apiField);

      if (!facetData) {
        throw new Error(`Facet data for "${facet.apiField}" not found in globalData.Count.cnv.${sectionData.section}`);
      }

      cy.fixture('RequestBody/ApplyFacet.json').then(fixture => {
        const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD', facet.apiField).replace('_VALUE', facetData.value).replace('_OP', facetData.op));

        cy.apiCall('POST', `occurrences/germline/cnv/${seq_id}/count`, body, Auth.token).then(res => {
          response = res;
          expect(response.status).to.eq(200);
          expect(response.body.count).to.eq(facetData.count);
        });
      });
    });
  });
});
