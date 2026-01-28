/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';

describe('Case Entity - Variants - SNV - Facets - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV');
  };

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldShowAllFacets('Variant');
    CaseEntity_Variants_Facets.snv.validations.shouldShowAllFacets('Gene');
    CaseEntity_Variants_Facets.snv.validations.shouldShowAllFacets('Pathogenicity');
    CaseEntity_Variants_Facets.snv.validations.shouldShowAllFacets('Frequency');
    CaseEntity_Variants_Facets.snv.validations.shouldShowAllFacets('Occurrence');
  });

  it('Expand and collapse', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldExpandAndCollapse();
  });

  it('Default operator', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldNumericalHaveDefaultOperator();
  });

  it('Dictionary', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldHaveDictionary();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldHaveTooltip();
  });
});
