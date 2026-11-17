/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Overview - AssociatedConditions - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  });

  it('OMIM', () => {
    VariantEntity_Overview.associatedConditions.validations.shouldShowField('omim', data.variantGermline);
  });
});
