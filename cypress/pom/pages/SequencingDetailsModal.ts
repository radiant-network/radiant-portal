/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

export const SequencingDetailsModal = {
  validations: {
    /**
     * Validates the subtitle of the modal.
     * @param dataSeq The seq object.
     */
    shouldHaveSubtitle(dataSeq: any) {
      cy.get(CommonSelectors.modal).contains(`Sequencing ${dataSeq.seq_id}`).should('exist');
    },
  },
};
