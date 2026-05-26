/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - SNV - Table - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SNV_Table.actions.showAllColumns();
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
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

  it('Gene Plus [SJRA-1506]', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    const resultCount = CaseEntity_Variants_SNV_Table.actions.getResultsCount();
    CaseEntity_Variants_SNV_Table.actions.clickTableCellLink(data.variantGermline, 'gene', true /*onPlusIcon*/);
    CaseEntity_Variants_SNV_Table.validations.shouldHaveSelectedQueryPill(data.variantGermline, 'gene');
    CaseEntity_Variants_SNV_Table.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.clickTableCellLink(data.variantGermline, 'freq');
    VariantEntity_Patients.validations.shouldHaveActiveTab();
  });
});
