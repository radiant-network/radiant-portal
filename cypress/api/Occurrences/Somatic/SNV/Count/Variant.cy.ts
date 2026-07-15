/// <reference types="cypress"/>
import { tableSomaticFacets } from 'pom/pages/CaseEntity_Variants_Facets';
import { findSectionData } from 'pom/shared/Utils';

describe('Occurrences - Somatic - SNV - Count - Variant', () => {
  let response: any;
  let Auth: any;
  let case_id: string;
  let seq_id: string;
  let task_id: string;
  let globalData: any;

  before(() => {
    globalData = Cypress.expose('globalData');
    Auth = globalData.Authorization;
    case_id = globalData.Count.somatic.case_id;
    seq_id = globalData.Count.somatic.seq_id;
    task_id = globalData.Count.somatic.task_id;
  });

  const sectionData = findSectionData(tableSomaticFacets, 'Variant');

  sectionData.facets.forEach(facet => {
    it(`${facet.name}`, () => {
      const facetData = globalData.Count.somatic[sectionData.section].find((f: { field: string }) => f.field === facet.apiField);

      if (!facetData) {
        throw new Error(`Facet data for "${facet.apiField}" not found in globalData.Count.somatic${sectionData.section}`);
      }

      cy.fixture('RequestBody/ApplyFacet.json').then(fixture => {
        const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD', facet.apiField).replace('_VALUE', facetData.value).replace('_OP', facetData.op));

        cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
          response = res;
          expect(response.status).to.eq(200);
          expect(response.body.count).to.eq(facetData.count);
        });
      });
    });
  });
});
