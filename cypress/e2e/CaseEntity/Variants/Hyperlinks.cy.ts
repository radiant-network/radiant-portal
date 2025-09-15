/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';
import { CaseEntity_Variants } from '../../../pom/pages/CaseEntity_Variants';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('Case Entity - Variants - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
    CaseEntity_Variants.actions.showAllColumns();
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants.actions.clickTableCellLink(data.variantGermline, 'variant');
    VariantEntity_Overview.validations.shouldHaveTitle(data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldHaveTableCellLink(data.variantGermline, 'dbsnp');
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldHaveTableCellLink(data.variantGermline, 'gene');
  });

  it('Gene Plus [SJRA-680]', () => {
    setupTest();
    CaseEntity_Variants.actions.clickTableCellLink(data.variantGermline, 'gene', true /*onPlusIcon*/);
    CaseEntity_Variants.validations.shouldHaveSelectedQueryPill(data.variantGermline, 'gene');
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants.actions.clickTableCellLink(data.variantGermline, 'freq');
    VariantEntity_Patients.validations.shouldHaveActiveTab();
  });
});
