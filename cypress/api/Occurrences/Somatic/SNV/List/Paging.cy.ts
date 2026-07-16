/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Occurrences - Somatic - SNV - List - Paging', () => {
  const dataCase = data;

  it('First 10 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 10,
      "page_index": 0
    }`;

    cy.apiCall('POST', `occurrences/somatic/snv/${dataCase.caseSomatic.case}/${dataCase.caseSomatic.seq.seq_id}/${dataCase.caseSomatic.task.task_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 10);
    });
  });

  it('First 20 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', `occurrences/somatic/snv/${dataCase.caseSomatic.case}/${dataCase.caseSomatic.seq.seq_id}/${dataCase.caseSomatic.task.task_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 20);
    });
  });

  it('Second 10 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const firstBody: string = `{
      "limit": 10,
      "page_index": 0
    }`;
    const secondBody: string = `{
      "limit": 10,
      "page_index": 1
    }`;
    let firstItemOfAll: any;

    cy.apiCall('POST', `occurrences/somatic/snv/${dataCase.caseSomatic.case}/${dataCase.caseSomatic.seq.seq_id}/${dataCase.caseSomatic.task.task_id}/list`, firstBody, Auth.token)
      .then(firstRes => {
        firstItemOfAll = firstRes.body[0].locus_id;
      })
      .then(() => {
        cy.apiCall('POST', `occurrences/somatic/snv/${dataCase.caseSomatic.case}/${dataCase.caseSomatic.seq.seq_id}/${dataCase.caseSomatic.task.task_id}/list`, secondBody, Auth.token);
      })
      .then((secondRes: any) => {
        expect(secondRes.status).to.eq(200);
        cy.validateItemCount(secondRes, 10);
        expect(secondRes.body[0].locus_id).to.not.eq(firstItemOfAll);
      });
  });

  it('No more items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 1000000,
      "page_index": 100000000
    }`;

    cy.apiCall('POST', `occurrences/somatic/snv/${dataCase.caseSomatic.case}/${dataCase.caseSomatic.seq.seq_id}/${dataCase.caseSomatic.task.task_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0);
    });
  });
});
