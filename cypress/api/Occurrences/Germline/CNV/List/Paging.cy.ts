/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Occurrences - Germline - CNV - List - Paging', () => {
  const dataCase = data.case;

  it('First 10 items', () => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "limit": 10,
      "page_index": 0
    }`;

    cy.apiCall('POST', `occurrences/germline/cnv/${dataCase.case}/${dataCase.seq.seq_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 10);
    });
  });

  it('First 20 items', () => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', `occurrences/germline/cnv/${dataCase.case}/${dataCase.seq.seq_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 20);
    });
  });

  it('Second 10 items', () => {
    const Auth = Cypress.env('globalData').Authorization;
    const firstBody: string = `{
      "limit": 10,
      "page_index": 0
    }`;
    const secondBody: string = `{
      "limit": 10,
      "page_index": 1
    }`;
    let firstItemOfAll: any;

    cy.apiCall('POST', `occurrences/germline/cnv/${dataCase.case}/${dataCase.seq.seq_id}/list`, firstBody, Auth.token).then(firstRes => {
      firstItemOfAll = firstRes.body[0].name;
    }).then(() => {
      cy.apiCall('POST', `occurrences/germline/cnv/${dataCase.case}/${dataCase.seq.seq_id}/list`, secondBody, Auth.token);
    }).then((secondRes: any) => {
      expect(secondRes.status).to.eq(200);
      cy.validateItemCount(secondRes, 10);
      expect(secondRes.body[0].name).to.not.eq(firstItemOfAll);
    });
  });

  it('No more items', () => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "limit": 1000000,
      "page_index": 100000000
    }`;

    cy.apiCall('POST', `occurrences/germline/cnv/${dataCase.case}/${dataCase.seq.seq_id}/list`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0);
    });
  });
});
