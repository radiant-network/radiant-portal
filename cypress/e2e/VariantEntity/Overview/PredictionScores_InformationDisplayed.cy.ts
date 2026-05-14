/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

describe('VariantEntity - Overview - PredictionScores - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('Scores', () => {
    setupTest();
    VariantEntity_Overview.predictionScores.validations.shouldShowScores(data.variantGermline);
  });
});
