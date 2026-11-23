/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

export const SequencingDetailsModal = {
  validations: {
    /**
     * Validates the subtitle of the modal.
     * @param dataSeq The seq object.
     */
    shouldHaveSubtitle(dataSeq: any) {
      cy.get(CommonSelectors.modal).contains(`Sequencing ID ${dataSeq.seq_id}`).should('exist');
    },
    /**
     * Validates the value of a field of the modal.
     * @param label The label of the field.
     * @param value The expected value.
     */
    shouldHaveField(label: string, value: string) {
      cy.get(CommonSelectors.modal).contains(label).parent().should('contain', value);
    },
  },
};
