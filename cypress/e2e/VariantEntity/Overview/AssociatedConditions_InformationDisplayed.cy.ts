/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

describe('VariantEntity - Overview - AssociatedConditions - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('OMIM', () => {
    setupTest();
    VariantEntity_Overview.associatedConditions.validations.shouldShowField('omim', data.variantGermline);
  });
});
