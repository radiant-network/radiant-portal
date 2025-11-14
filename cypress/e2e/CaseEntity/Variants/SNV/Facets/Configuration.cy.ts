/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Facets } from 'pom/pages/CaseEntity_Variants_SNV_Facets';

describe('Case Entity - Variants - SNV - Facets - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldShowAllFacets('Variant');
    CaseEntity_Variants_SNV_Facets.validations.shouldShowAllFacets('Gene');
    CaseEntity_Variants_SNV_Facets.validations.shouldShowAllFacets('Pathogenicity');
    CaseEntity_Variants_SNV_Facets.validations.shouldShowAllFacets('Frequency');
    CaseEntity_Variants_SNV_Facets.validations.shouldShowAllFacets('Occurrence');
  });

  it('Expand and collapse', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldExpandAndCollapse();
  });

  it('Default operator', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldNumericalHaveDefaultOperator();
  });

  it('Dictionary', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldHaveDictionary();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldHaveTooltip();
  });
});
