/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';

describe('Case Entity - Variants - CNV - Facets - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
  };

  it('MultiSelect [SJRA-1390]', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldRequestOnApply('Variant', 'variant_type');
  });

  it('Numerical', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldRequestOnApply('Variant', 'copy_number');
  });
});
