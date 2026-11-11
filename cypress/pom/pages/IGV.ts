/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';
import { CommonSelectors } from 'pom/shared/Selectors';
import { CommonTexts } from 'pom/shared/Texts';

// igv.js renders the browser in a shadow root of its container.
const findInIGV = (selector: string) => cy.get(CommonSelectors.igvContainer).shadow().find(selector);

export const IGV = {
  actions: {
    /**
     * Clicks on the zoom out button.
     */
    clickZoomOut() {
      findInIGV(CommonSelectors.igvZoomButtons).eq(0).click({ force: true });
    },
    /**
     * Clicks on the zoom in button several times.
     * @param clickCount The number of clicks needed to reach the max zoom (each click halves the window size).
     */
    maxZoom(clickCount: number = 5) {
      for (let i = 0; i < clickCount; i++) {
        findInIGV(CommonSelectors.igvZoomButtons).eq(1).clickAndWait({ force: true });
      }
      IGV.validations.shouldBeMaxZoom();
    },
  },

  validations: {
    /**
     * Validates the window size value, which must be the minimum value.
     */
    shouldBeMaxZoom() {
      findInIGV(CommonSelectors.igvWindowSize).contains(CommonTexts.en.igvMaxZoom).should('exist');
    },
    /**
     * Validates the title of the modal.
     */
    shouldHaveTitle() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.title}`).contains(CommonTexts.en.igvTitle).should('exist');
    },
    /**
     * Validates the display of the track order.
     * @param context The context IGV is opened from: the CNV one shows public tracks below the case tracks.
     */
    shouldHaveTracks(context: 'snv' | 'cnv' = 'snv') {
      const publicTracks = context === 'cnv' ? [CommonTexts.en.igvTrackDGV, CommonTexts.en.igvTrackClinVarSVs, CommonTexts.en.igvTrackClinGenRegionHaploinsufficiency, CommonTexts.en.igvTrackClinGenRegionTriplosensitivity] : [];
      findInIGV(CommonSelectors.igvTrack).eq(0).contains(CommonTexts.en.igvTrackRefseq).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(1).contains(CommonTexts.en.igvTrackCNVs(data.variantGermline.igv.proband, 'proband')).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(2).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.proband, 'proband')).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(3).contains(CommonTexts.en.igvTrackCNVs(data.variantGermline.igv.mother, 'mother')).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(4).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.mother, 'mother')).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(5).contains(CommonTexts.en.igvTrackCNVs(data.variantGermline.igv.father, 'father')).should('exist');
      findInIGV(CommonSelectors.igvTrack).eq(6).contains(CommonTexts.en.igvTrackReads(data.variantGermline.igv.father, 'father')).should('exist');
      publicTracks.forEach((name, index) => {
        findInIGV(CommonSelectors.igvTrack)
          .eq(7 + index)
          .contains(name)
          .should('exist');
      });
      findInIGV(CommonSelectors.igvTrack)
        .eq(7 + publicTracks.length)
        .should('not.exist');
    },
    /**
     * Validates the window size value, which must not be the minimum value.
     */
    shouldNotBeMaxZoom() {
      findInIGV(CommonSelectors.igvWindowSize).contains(CommonTexts.en.igvMaxZoom).should('not.exist');
    },
    /**
     * Validates the absence of an error message.
     */
    shouldNotHaveErrorMessage() {
      findInIGV(CommonSelectors.igvError).should('not.exist');
    },
  },
};
