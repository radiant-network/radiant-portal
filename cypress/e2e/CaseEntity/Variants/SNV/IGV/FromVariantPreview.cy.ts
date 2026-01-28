/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { IGV } from 'pom/pages/IGV';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { VariantPreview } from 'pom/pages/VariantPreview';

describe('Case Entity - Variants - SNV - IGV - From variant preview', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SNV_Table.actions.selectAction(data.variantGermline, 'Preview');
    VariantPreview.actions.clickOpenIGV();
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
