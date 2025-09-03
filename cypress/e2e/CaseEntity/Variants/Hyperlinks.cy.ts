/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
    VariantsTable.actions.showAllColumns();
  };

  it('Variant', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'variant');
    cy.get('h1').contains(data.variantGermline.variant).should('exist');
  });

  it('dbSNP', () => {
    setupTest();
    VariantsTable.validations.shouldHaveTableCellLink(data.variantGermline, 'dbsnp');
  });

  it('Gene', () => {
    setupTest();
    VariantsTable.validations.shouldHaveTableCellLink(data.variantGermline, 'gene');
  });

  it('Gene Plus [SJRA-680]', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'gene', true /*onPlusIcon*/);
    VariantsTable.validations.shouldHaveSelectedQueryPill(data.variantGermline, 'gene');
  });

  it('Freq.', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'freq');
    cy.get('[data-active="true"]:contains("Patients")').should('exist');
  });
});
