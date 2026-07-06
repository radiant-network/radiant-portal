/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { UploadListModal } from 'pom/pages/UploadListModal';

describe('Case Entity - Variants - Somatic - SNV - Facets - Upload List', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.somatic.actions.clickSidebarSection('Gene');
  };

  const setupUpload = () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.openUploadListModal();
    UploadListModal.actions.typeIdentifiers(`${data.variantSomatic.gene.toLowerCase()}\nunknownGene`);
  };

  it('Info popover', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.openUploadListModal();
    UploadListModal.validations.shouldShowPopover();
  });

  it('Matched and unmatched content', () => {
    setupUpload();
    UploadListModal.actions.toggleSummary();
    UploadListModal.validations.shouldTableContain('matched', data.variantSomatic.gene);
    UploadListModal.actions.selectTab(1 /*Unmatched*/);
    UploadListModal.validations.shouldTableContain('unmatched', 'unknownGene');
  });

  it('Collapsible summary', () => {
    setupUpload();
    UploadListModal.actions.toggleSummary();
    UploadListModal.validations.shouldSummaryBeVisible(true);
    UploadListModal.actions.toggleSummary();
    UploadListModal.validations.shouldSummaryBeVisible(false);
  });

  it('Clear button', () => {
    setupUpload();
    UploadListModal.actions.clickClearButton();
    UploadListModal.validations.shouldBeCleared();
  });

  it('Cancel button', () => {
    setupUpload();
    UploadListModal.actions.clickCancelButton();
    UploadListModal.validations.shouldModalOpen(false /*shouldBeOpen*/);
  });

  it('Upload button', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_Facets.somatic.actions.openUploadListModal();
    UploadListModal.actions.typeIdentifiers(`${data.variantSomatic.gene}\nunknownGene`);
    UploadListModal.actions.clickUploadButton();
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveGeneSymbolPill([data.variantSomatic.gene]);
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });
});
