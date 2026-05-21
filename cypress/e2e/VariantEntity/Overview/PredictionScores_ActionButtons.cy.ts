/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';
import { PredictionScoresModal } from 'pom/pages/PredictionScoresModal';

describe('VariantEntity - Overview - PredictionScores - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('View all', () => {
    setupTest();
    VariantEntity_Overview.predictionScores.actions.openViewAll();
    PredictionScoresModal.validations.shouldShowScores(data.variantGermline.predictionScores);
  });
});
