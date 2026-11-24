/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Somatic - SNV (TN) - Facets - Search By Variant', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', { cohort: 'TN' });
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.somatic.actions.clickSidebarSection('Variant');
  };

  const shouldApplyVariant = (input: string) => {
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant(input);
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveVariantIdPill([data.variantSomatic.variant]);
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  };

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldSearchByHaveTooltip('hgvsg', 'searchByVariantTooltip');
  });

  it('Apply - Locus', () => {
    setupTest();
    shouldApplyVariant(data.variantSomatic.locus);
  });

  it('Apply - HGVSg', () => {
    setupTest();
    shouldApplyVariant(data.variantSomatic.variant);
  });

  it('Apply - dbSNP ID (case-insensitive)', () => {
    setupTest();
    shouldApplyVariant(data.variantSomatic.dbsnp.toUpperCase());
  });

  it('Same variant submitted twice', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant(data.variantSomatic.locus);
    CaseEntity_Variants_Facets.somatic.actions.searchVariant(data.variantSomatic.dbsnp, false /*waitForList*/);
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveVariantIdPill([data.variantSomatic.variant]);
  });

  it('Input cleared and focused, confirmation announced', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant(data.variantSomatic.locus);
    CaseEntity_Variants_Facets.somatic.validations.shouldSearchByVariantInputBeClearedAndFocused();
    CaseEntity_Variants_Facets.somatic.validations.shouldAnnounceSearchByVariantMessage(data.variantSomatic.variant);
  });

  it('Not found in run', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant('rs999999999', false /*waitForList*/);
    CaseEntity_Variants_Facets.somatic.validations.shouldShowSearchByVariantDialog('notFound');
    CaseEntity_Variants_Facets.somatic.actions.closeSearchByVariantDialog();
    CaseEntity_Variants_Facets.somatic.validations.shouldNotHaveAnyPill();
  });

  it('Invalid format', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant('BRAF', false /*waitForList*/);
    CaseEntity_Variants_Facets.somatic.validations.shouldShowSearchByVariantDialog('invalid');
    CaseEntity_Variants_Facets.somatic.actions.closeSearchByVariantDialog();
    CaseEntity_Variants_Facets.somatic.validations.shouldNotHaveAnyPill();
  });

  it('Pill opens no dropdown', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.actions.searchVariant(data.variantSomatic.locus);
    CaseEntity_Variants_Facets.somatic.validations.shouldNotOpenVariantIdPillDropdown();
  });
});
