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

  it('Valider les liens disponibles Lien Variant', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'variant');
    cy.get('h1').contains(data.variantGermline.variant).should('exist');
  });

  it('Valider les liens disponibles Lien dbSNP', () => {
    setupTest();
    VariantsTable.validations.shouldHaveTableCellLink(data.variantGermline, 'dbsnp');
  });

  it('Valider les liens disponibles Lien Gène', () => {
    setupTest();
    VariantsTable.validations.shouldHaveTableCellLink(data.variantGermline, 'gene');
  });
 
  it('Valider les liens disponibles Lien Gène Plus [SJRA-664]', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'gene', true/*onPlusIcon*/);
    VariantsTable.validations.shouldHaveSelectedQueryPill(data.variantGermline, 'gene');
  });
 
  it('Valider les liens disponibles Lien Freq. [SJRA-648]', () => {
    setupTest();
    VariantsTable.actions.clickTableCellLink(data.variantGermline, 'freq');
    cy.get('[data-active="true"]:contains("Patients")').should('exist');
  });
});
