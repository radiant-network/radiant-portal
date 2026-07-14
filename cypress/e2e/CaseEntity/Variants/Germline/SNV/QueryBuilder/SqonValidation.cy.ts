/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Query builder - SQON validation', () => {
  const setupWithFilter = (filterName: string) => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown(filterName);
  };

  const setupEmpty = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder (empty query)
  };

  it('Two pills combined with AND', () => {
    setupWithFilter('Cypress_QB_1Pill');
    CaseEntity_Variants_QueryBuilder.snv.actions.addSecondPillAndCaptureCount();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldMatchSentSqon('ComplexSqonTwoPills.json', { _OP: 'and', ...{ _CHROM_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.chromosome, _VTYPE_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.variantType } });
  });

  it('Two pills combined with OR', () => {
    setupWithFilter('Cypress_QB_2Pills');
    CaseEntity_Variants_QueryBuilder.snv.actions.toggleOperatorAndCaptureCount();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldMatchSentSqon('ComplexSqonTwoPills.json', { _OP: 'or', ...{ _CHROM_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.chromosome, _VTYPE_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.variantType } });
  });

  it('Pill with the not-in operator', () => {
    setupEmpty();
    CaseEntity_Variants_QueryBuilder.snv.actions.buildNotInPillAndCaptureCount();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldMatchSentSqon('ComplexSqonNotIn.json', { _CHROM_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.chromosome, _VTYPE_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.variantType });
  });

  it('Two queries combined with OR', () => {
    setupWithFilter('Cypress_QB_2Queries');
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueriesAndCaptureCount('or');
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldMatchSentSqon('ComplexSqonCombined.json', { _OP: 'or', ...{ _CHROM_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.chromosome, _VTYPE_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.variantType } });
  });

  it('Two queries combined with AND', () => {
    setupWithFilter('Cypress_QB_2Queries');
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueriesAndCaptureCount('and');
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldMatchSentSqon('ComplexSqonCombined.json', { _OP: 'and', ...{ _CHROM_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.chromosome, _VTYPE_FIELD: CaseEntity_Variants_QueryBuilder.snv.fields.variantType } });
  });
});
