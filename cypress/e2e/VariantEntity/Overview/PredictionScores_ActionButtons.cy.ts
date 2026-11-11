/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';
import { PredictionScoresModal } from 'pom/pages/PredictionScoresModal';

describe('VariantEntity - Overview - PredictionScores - Action Buttons', () => {
  const setupTest = (locusId: string) => {
    cy.login();
    cy.visitVariantOverviewPage(locusId);
  };

  it('View all', () => {
    setupTest(data.variantGermline.locus_id);
    VariantEntity_Overview.predictionScores.actions.openViewAll();
    PredictionScoresModal.validations.shouldShowScores(data.variantGermline.predictionScores);
  });

  it('View all - LRT and pLI', () => {
    setupTest(data.variantPredictionScores.locus_id);
    VariantEntity_Overview.predictionScores.actions.openViewAll();
    PredictionScoresModal.validations.shouldShowScores(data.variantPredictionScores.predictionScores);
  });
});
