/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

describe('VariantEntity - Overview - Classification - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('Exomiser', () => {
    setupTest();
    VariantEntity_Overview.classification.validations.shouldShowField('exomiser', data.variantGermline);
  });
});
