/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Search - Paging', () => {
  const dataCase = data.case;

  it('First item', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 1,
      "page_index": 0
    }`;

    cy.apiCall('POST', `cases/search`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 1, 'list');
    });
  });

  it('First 2 items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 2,
      "page_index": 0
    }`;

    cy.apiCall('POST', `cases/search`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 2, 'list');
    });
  });

  it('Second item', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const firstBody: string = `{
      "limit": 1,
      "page_index": 0
    }`;
    const secondBody: string = `{
      "limit": 1,
      "page_index": 1
    }`;
    let firstItemOfAll: any;

    cy.apiCall('POST', `cases/search`, firstBody, Auth.token)
      .then(firstRes => {
        firstItemOfAll = firstRes.body.list[0].case_id;
      })
      .then(() => {
        cy.apiCall('POST', `cases/search`, secondBody, Auth.token);
      })
      .then((secondRes: any) => {
        expect(secondRes.status).to.eq(200);
        cy.validateItemCount(secondRes, 1, 'list');
        expect(secondRes.body.list[0].case_id).to.not.eq(firstItemOfAll);
      });
  });

  it('No more items', () => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "limit": 1000000,
      "page_index": 100000000
    }`;

    cy.apiCall('POST', `cases/search`, body, Auth.token).then(res => {
      expect(res.status).to.eq(200);
      cy.validateItemCount(res, 0, 'list');
    });
  });
});
