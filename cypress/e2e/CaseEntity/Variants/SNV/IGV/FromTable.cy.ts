/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { IGV } from 'pom/pages/IGV';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - IGV - From table', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SNV_Table.actions.selectAction(data.variantGermline, 'Open in IGV');
  };

  it('Information displayed', () => {
    setupTest();
    IGV.validations.shouldHaveTitle();
    IGV.validations.shouldHaveTracks();
    IGV.validations.shouldNotHaveErrorMessage();
  });

  it('Zoom', () => {
    setupTest();
    IGV.actions.maxZoom();
    IGV.actions.clickZoomOut();

    IGV.validations.shouldNotBeMaxZoom();
  });
});
