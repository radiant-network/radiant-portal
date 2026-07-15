/// <reference types="cypress"/>

describe('Occurrences - Somatic - SNV - Count - Complex SQON', () => {
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

  it('Two pills combined with AND', () => {
    const complexData = globalData.Count.somatic.Complex.twoPillsAnd;

    cy.fixture('RequestBody/CountTwoPillsAnd.json').then(fixture => {
      const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD1', complexData.field1).replace('_VALUE1', complexData.value1).replace('_FIELD2', complexData.field2).replace('_VALUE2', complexData.value2));

      cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
        response = res;
        expect(response.status).to.eq(200);
        if (complexData.count instanceof RegExp) {
          expect(response.body.count.toString()).to.match(complexData.count);
        } else {
          expect(response.body.count).to.eq(complexData.count);
        }
      });
    });
  });

  it('Two pills combined with OR', () => {
    const complexData = globalData.Count.somatic.Complex.twoPillsOr;

    cy.fixture('RequestBody/CountTwoPillsOr.json').then(fixture => {
      const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD1', complexData.field1).replace('_VALUE1', complexData.value1).replace('_FIELD2', complexData.field2).replace('_VALUE2', complexData.value2));

      cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
        response = res;
        expect(response.status).to.eq(200);
        if (complexData.count instanceof RegExp) {
          expect(response.body.count.toString()).to.match(complexData.count);
        } else {
          expect(response.body.count).to.eq(complexData.count);
        }
      });
    });
  });

  it('Pill with the not-in operator', () => {
    const complexData = globalData.Count.somatic.Complex.notIn;

    cy.fixture('RequestBody/CountNotIn.json').then(fixture => {
      const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD1', complexData.field1).replace('_VALUE1', complexData.value1));

      cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
        response = res;
        expect(response.status).to.eq(200);
        if (complexData.count instanceof RegExp) {
          expect(response.body.count.toString()).to.match(complexData.count);
        } else {
          expect(response.body.count).to.eq(complexData.count);
        }
      });
    });
  });

  it('Two queries combined with OR', () => {
    const complexData = globalData.Count.somatic.Complex.combined;

    cy.fixture('RequestBody/CountCombined.json').then(fixture => {
      const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD1', complexData.field1).replace('_VALUE1', complexData.value1).replace('_FIELD2', complexData.field2).replace('_VALUE2', complexData.value2).replace('_OP', 'or'));

      cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
        response = res;
        expect(response.status).to.eq(200);
        if (complexData.countOr instanceof RegExp) {
          expect(response.body.count.toString()).to.match(complexData.countOr);
        } else {
          expect(response.body.count).to.eq(complexData.countOr);
        }
      });
    });
  });

  it('Two queries combined with AND', () => {
    const complexData = globalData.Count.somatic.Complex.combined;

    cy.fixture('RequestBody/CountCombined.json').then(fixture => {
      const body = JSON.parse(JSON.stringify(fixture).replace('_FIELD1', complexData.field1).replace('_VALUE1', complexData.value1).replace('_FIELD2', complexData.field2).replace('_VALUE2', complexData.value2).replace('_OP', 'and'));

      cy.apiCall('POST', `occurrences/somatic/snv/${case_id}/${seq_id}/${task_id}/count`, body, Auth.token).then(res => {
        response = res;
        expect(response.status).to.eq(200);
        if (complexData.countAnd instanceof RegExp) {
          expect(response.body.count.toString()).to.match(complexData.countAnd);
        } else {
          expect(response.body.count).to.eq(complexData.countAnd);
        }
      });
    });
  });
});
