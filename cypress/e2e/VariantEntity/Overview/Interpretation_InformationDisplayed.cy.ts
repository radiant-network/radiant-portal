/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Overview - Interpretation - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  });

  it('MyNetwork', () => {
    VariantEntity_Overview.interpretation.validations.shouldShowField('my_network', data.variantGermline);
  });
});
