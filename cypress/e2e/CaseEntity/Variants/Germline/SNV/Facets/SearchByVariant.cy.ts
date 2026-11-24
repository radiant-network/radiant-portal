/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Germline - SNV - Facets - Search By Variant', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.snv.actions.clickSidebarSection('Variant');
  };

  const shouldApplyVariant = (input: string) => {
    const resultCount = CaseEntity_Variants_SNV_Table.germline.actions.getResultsCount();
    CaseEntity_Variants_Facets.snv.actions.searchVariant(input);
    CaseEntity_Variants_Facets.snv.validations.shouldHaveVariantIdPill([data.variantGermline.variant]);
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  };

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldSearchByHaveTooltip('hgvsg', 'searchByVariantTooltip');
  });

  it('Apply - Locus', () => {
    setupTest();
    shouldApplyVariant(data.variantGermline.locus);
  });

  it('Apply - HGVSg', () => {
    setupTest();
    shouldApplyVariant(data.variantGermline.variant);
  });

  it('Apply - dbSNP ID (case-insensitive)', () => {
    setupTest();
    shouldApplyVariant(data.variantGermline.dbsnp.toUpperCase());
  });

  it('Apply - ClinVar ID', () => {
    setupTest();
    shouldApplyVariant(data.variantGermline.clinvar_name);
  });

  it('Same variant submitted twice', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.actions.searchVariant(data.variantGermline.locus);
    CaseEntity_Variants_Facets.snv.actions.searchVariant(data.variantGermline.dbsnp, false /*waitForList*/);
    CaseEntity_Variants_Facets.snv.validations.shouldHaveVariantIdPill([data.variantGermline.variant]);
  });

  it('Input cleared and focused, confirmation announced', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.actions.searchVariant(data.variantGermline.locus);
    CaseEntity_Variants_Facets.snv.validations.shouldSearchByVariantInputBeClearedAndFocused();
    CaseEntity_Variants_Facets.snv.validations.shouldAnnounceSearchByVariantMessage(data.variantGermline.variant);
  });

  it('Not found in run', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.actions.searchVariant('rs999999999', false /*waitForList*/);
    CaseEntity_Variants_Facets.snv.validations.shouldShowSearchByVariantDialog('notFound');
    CaseEntity_Variants_Facets.snv.actions.closeSearchByVariantDialog();
    CaseEntity_Variants_Facets.snv.validations.shouldNotHaveAnyPill();
  });

  it('Invalid format', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.actions.searchVariant('BRAF', false /*waitForList*/);
    CaseEntity_Variants_Facets.snv.validations.shouldShowSearchByVariantDialog('invalid');
    CaseEntity_Variants_Facets.snv.actions.closeSearchByVariantDialog();
    CaseEntity_Variants_Facets.snv.validations.shouldNotHaveAnyPill();
  });

  it('Pill opens no dropdown', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.actions.searchVariant(data.variantGermline.locus);
    CaseEntity_Variants_Facets.snv.validations.shouldNotOpenVariantIdPillDropdown();
  });
});
