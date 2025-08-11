/// <reference types="cypress"/>
import '../../../support/commands';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

beforeEach(() => {
  cy.login();
  cy.visitCaseVariantsPage('1');
  VariantsTable.actions.showAllColumns();
});

describe('Case Entity - Variants - Sort', () => {
  it('Variant', () => {
    VariantsTable.validations.shouldSortColumn('variant');
  });

  it('Type', () => {
    VariantsTable.validations.shouldSortColumn('type');
  });

  it('Gène', () => {
    VariantsTable.validations.shouldSortColumn('gene');
  });

  it('gnomAD', () => {
    VariantsTable.validations.shouldSortColumn('gnomad');
  });

  it('gnomAD ALT', () => {
    VariantsTable.validations.shouldSortColumn('gnomad_alt');
  });

  it('RQDM G', () => {
    VariantsTable.validations.shouldSortColumn('rqdm');
  });

  it('CMC', () => {
    VariantsTable.validations.shouldSortColumn('cmc');
  });

  it('Hotspot', () => {
    VariantsTable.validations.shouldSortColumn('hotspot');
  });

  it('Exo. (var)', () => {
    VariantsTable.validations.shouldSortColumn('exomiser');
  });

  it('Tier', () => {
    VariantsTable.validations.shouldSortColumn('tier');
  });

  it('Max Exo.', () => {
    VariantsTable.validations.shouldSortColumn('max_exomiser');
  });

  it('ACMG F.', () => {
    VariantsTable.validations.shouldSortColumn('acmg_franklin');
  });

  it('ACMG E.', () => {
    VariantsTable.validations.shouldSortColumn('acmg_exomiser');
  });

  it('Multiple', () => {
    VariantsTable.actions.sortColumn('gnomad');
    VariantsTable.actions.sortColumn('variant', false/*needIntercept*/);
    VariantsTable.actions.sortColumn('variant');
    VariantsTable.validations.shouldHaveFirstRowValue(/^(chrY:g.9906510G>C|chrY:g.9908200A>C)$/, 'variant');
  });
});
  