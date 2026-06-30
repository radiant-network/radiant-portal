/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('Case Entity - Variants - Somatic - SNV - Table - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', data.variantSomatic.sqon);
    CaseEntity_Variants_SNV_Table.somatic.actions.showAllColumns();
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.actions.clickTableCellLink(data.variantSomatic, 'variant');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldDrawerOpen(data.variantSomatic);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldHaveTableCellLink(data.variantSomatic, 'dbsnp');
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldHaveTableCellLink(data.variantSomatic, 'gene');
  });

  it('Gene Plus [SJRA-1682]', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_SNV_Table.somatic.actions.clickTableCellLink(data.variantSomatic, 'gene', true /*onPlusIcon*/);
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldHaveSelectedQueryPill(data.variantSomatic, 'gene');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Freq. TN', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.actions.clickTableCellLink(data.variantSomatic, 'freq_tn');
    VariantEntity_Patients.validations.shouldHaveTitle(data.variantSomatic);
    VariantEntity_Patients.validations.shouldHaveActiveTab();
  });

  it('Freq. G', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.actions.clickTableCellLink(data.variantSomatic, 'freq_g');
    VariantEntity_Patients.validations.shouldHaveTitle(data.variantSomatic);
    VariantEntity_Patients.validations.shouldHaveActiveTab();
  });
});
