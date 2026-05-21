/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getPredictionDisplay, isEmpty } from 'pom/shared/Utils';

const selectors = {
  modal: '[data-cy="prediction-scores-dialog"]',
};

export const PredictionScoresModal = {
  validations: {
    /**
     * Validates each score within the modal.
     * @param dataScores The prediction scores data object.
     */
    shouldShowScores(dataScores: any) {
      Object.entries(dataScores).forEach(([key, value]) => {
        cy.get(`${selectors.modal} ${CommonSelectors.datacy(value == null ? `${key}-empty` : key)}`).should('contain', getPredictionDisplay(key));
        cy.get(`${selectors.modal} ${CommonSelectors.datacy(value == null ? `${key}-empty` : key)}`).should('contain', value == null ? '-' : value);
      });
    },
  },
};
