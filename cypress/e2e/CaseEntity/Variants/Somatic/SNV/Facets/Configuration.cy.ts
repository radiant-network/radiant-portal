/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Facets - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldShowAllFacets('Variant');
    CaseEntity_Variants_Facets.somatic.validations.shouldShowAllFacets('Gene');
    CaseEntity_Variants_Facets.somatic.validations.shouldShowAllFacets('Pathogenicity');
    CaseEntity_Variants_Facets.somatic.validations.shouldShowAllFacets('Frequency');
    CaseEntity_Variants_Facets.somatic.validations.shouldShowAllFacets('Occurrence');
  });

  it('Expand and collapse', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldExpandAndCollapse();
  });

  it('Default operator', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldNumericalHaveDefaultOperator();
  });

  it('Dictionary', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveDictionary();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveTooltip();
  });
});
