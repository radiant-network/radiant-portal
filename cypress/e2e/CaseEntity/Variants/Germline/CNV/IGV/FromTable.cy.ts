/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { IGV } from 'pom/pages/IGV';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - Germline - CNV - IGV - From table', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickIGVButton(data.cnvGermline);
  };

  it('Information displayed', () => {
    setupTest();
    IGV.validations.shouldHaveTitle();
    IGV.validations.shouldHaveTracks('cnv');
    IGV.validations.shouldNotHaveErrorMessage();
  });

  it('Zoom', () => {
    setupTest();
    IGV.actions.maxZoom(9);
    IGV.actions.clickZoomOut();

    IGV.validations.shouldNotBeMaxZoom();
  });
});
