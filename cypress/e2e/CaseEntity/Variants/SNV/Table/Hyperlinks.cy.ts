/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('Case Entity - Variants - SNV - Table - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SNV_Table.actions.showAllColumns();
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.clickTableCellLink(data.variantGermline, 'variant');
    CaseEntity_Variants_SNV_Table.validations.shouldDrawerOpen(data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldHaveTableCellLink(data.variantGermline, 'dbsnp');
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldHaveTableCellLink(data.variantGermline, 'gene');
  });

  it('Gene Plus', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.clickTableCellLink(data.variantGermline, 'gene', true /*onPlusIcon*/);
    CaseEntity_Variants_SNV_Table.validations.shouldHaveSelectedQueryPill(data.variantGermline, 'gene');
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.clickTableCellLink(data.variantGermline, 'freq');
    VariantEntity_Patients.validations.shouldHaveActiveTab();
  });
});
