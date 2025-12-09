/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';
import { CommonSelectors } from 'pom/shared/Selectors';
import { CommonTexts } from 'pom/shared/Texts';

export const IGV = {
  actions: {
    /**
     * Clicks on the zoom out button.
     */
    clickZoomOut() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(0).click({ force: true });
    },
    /**
     * Clicks on the zoom in button several times.
     */
    maxZoom() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(1).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(1).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(1).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(1).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvZoomButtons}`).eq(1).clickAndWait({ force: true });
      IGV.validations.shouldBeMaxZoom();
    },
  },

  validations: {
    /**
     * Validates the window size value, which must be the minimum value.
     */
    shouldBeMaxZoom() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvWindowSize}`).contains(CommonTexts.en.igvMaxZoom).should('exist');
    },
    /**
     * Validates the title of the modal.
     */
    shouldHaveTitle() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.title}`).contains(CommonTexts.en.igvTitle).should('exist');
    },
    /**
     * Validates the display of the track order.
     */
    shouldHaveTracks() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvTrack}`).eq(0).contains(CommonTexts.en.igvTrackRefseq).should('exist');
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvTrack}`).eq(1).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.proband, 'proband')).should('exist');
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvTrack}`).eq(2).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.mother, 'mother')).should('exist');
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvTrack}`).eq(3).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.father, 'father')).should('exist');
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvTrack}`).eq(4).should('not.exist');
    },
    /**
     * Validates the window size value, which must not be the minimum value.
     */
    shouldNotBeMaxZoom() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvWindowSize}`).contains(CommonTexts.en.igvMaxZoom).should('not.exist');
    },
    /**
     * Validates the absence of an error message.
     */
    shouldNotHaveErrorMessage() {
      cy.get(`${CommonSelectors.igvContainer} ${CommonSelectors.igvError}`).should('not.exist');
    },
  },
};
