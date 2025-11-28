/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';

describe('Case Entity - Variants - CNV - Facets - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldShowAllFacets('Variant');
    CaseEntity_Variants_Facets.cnv.validations.shouldShowAllFacets('Gene');
    CaseEntity_Variants_Facets.cnv.validations.shouldShowAllFacets('Frequency');
    CaseEntity_Variants_Facets.cnv.validations.shouldShowAllFacets('Metric QC');
  });

  it('Expand and collapse', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldExpandAndCollapse();
  });

  it('Default operator', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldNumericalHaveDefaultOperator();
  });

  it('Dictionary', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldHaveDictionary();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldHaveTooltip();
  });
});
