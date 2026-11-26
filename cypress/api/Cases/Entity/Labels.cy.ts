/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

type Member = { relationship_to_proband: string; ethnicities?: object[]; exams?: { exam_code: string; name: string }[] };

describe('Cases - Entity - Labels', () => {
  const caseId = data.case.case;
  const member = (body: { members: Member[] }, relationship: string) => body.members.find(m => m.relationship_to_proband === relationship);
  const exams = (body: { members: Member[] }, relationship: string) => member(body, relationship)?.exams?.map(({ exam_code, name }) => ({ exam_code, name }));
  let responseFr: any;
  let responseDefault: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${caseId}`, '', Auth.token, 3, { 'Accept-Language': 'fr' }).then(res => {
      responseFr = res;
    });
    cy.apiCall('GET', `cases/${caseId}`, '', Auth.token).then(res => {
      responseDefault = res;
    });
  });

  it('Request status', () => {
    expect(responseFr.status).to.eq(200);
    expect(responseDefault.status).to.eq(200);
  });

  it('Return content in French', () => {
    Object.entries(data.case.ethnicities).forEach(([relationship, expected]) => {
      expect(member(responseFr.body, relationship)?.ethnicities, `${relationship} ethnicities`).to.have.deep.members(expected.map(({ code, name_fr }) => ({ code, name: name_fr })));
    });
    Object.entries(data.case.exams).forEach(([relationship, expected]) => {
      expect(exams(responseFr.body, relationship), `${relationship} exams`).to.have.deep.members(expected.map(({ exam_code, name_fr }) => ({ exam_code, name: name_fr })));
    });
  });

  it('Return content in English without header', () => {
    Object.entries(data.case.ethnicities).forEach(([relationship, expected]) => {
      expect(member(responseDefault.body, relationship)?.ethnicities, `${relationship} ethnicities`).to.have.deep.members(expected.map(({ code, name_en }) => ({ code, name: name_en })));
    });
    Object.entries(data.case.exams).forEach(([relationship, expected]) => {
      expect(exams(responseDefault.body, relationship), `${relationship} exams`).to.have.deep.members(expected.map(({ exam_code, name_en }) => ({ exam_code, name: name_en })));
    });
  });
});
