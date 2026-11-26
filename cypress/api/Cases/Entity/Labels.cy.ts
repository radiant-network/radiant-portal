/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

type Member = { relationship_to_proband: string; ethnicities?: object[]; exams?: { exam_code: string; name: string }[] };

describe('Cases - Entity - Labels', () => {
  const caseId = data.case.case;
  const member = (body: { members: Member[] }, relationship: string) => body.members.find(m => m.relationship_to_proband === relationship);
  const exams = (body: { members: Member[] }, relationship: string) => member(body, relationship)?.exams?.map(({ exam_code, name }) => ({ exam_code, name }));
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/${caseId}`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content in English without header', () => {
    Object.entries(data.case.ethnicities).forEach(([relationship, expected]) => {
      expect(member(response.body, relationship)?.ethnicities, `${relationship} ethnicities`).to.have.deep.members(expected.map(({ code, name_en }) => ({ code, name: name_en })));
    });
    Object.entries(data.case.exams).forEach(([relationship, expected]) => {
      expect(exams(response.body, relationship), `${relationship} exams`).to.have.deep.members(expected.map(({ exam_code, name_en }) => ({ exam_code, name: name_en })));
    });
  });
});
