/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getClass, getExternalRefDisplay, getPredictionDisplay, getUrlLink, isEmpty } from 'pom/shared/Utils';

const selectors = {
  tab: '[data-cy="overview-tab"]',

  mostDeleterious: {
    card: '[data-cy="most-deleterious-consequence-card"]',
  },

  interpretation: {
    card: '[data-cy="interpretation-card"]',
  },

  classification: {
    card: '[data-cy="classification-card"]',
  },

  predictionScores: {
    card: '[data-cy="prediction-scores-card"]',
    viewAllButton: '[data-cy="view-all"]',
  },

  associatedConditions: {
    card: '[data-cy="associated-conditions-card"]',
  },

  externalReferences: {
    card: '[data-cy="external-references-card"]',
  },
};

export const VariantEntity_Overview = {
  validations: {
    /**
     * Checks that the tab is active.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataVariant The variant object.
     */
    shouldHaveTitle(dataVariant: any) {
      cy.get(CommonSelectors.title).contains(dataVariant.variant).should('exist');
    },
  },

  mostDeleterious: {
    actions: {
      /**
       * Clicks the link of a specific field to navigate to its destination page within the app.
       * @param fieldId The ID of the field to click.
       * @param dataVariant The variant object.
       */
      clickLink(fieldId: string, dataVariant: any) {
        switch (fieldId) {
          case 'clinvar_classifications':
            cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(dataVariant.clinvar_classifications[0])}`).clickAndWait({ force: true });
            break;
          default:
            cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`).clickAndWait({ force: true });
            break;
        }
      },
    },
    validations: {
      /**
       * Validates the content of a specific field in the Most Deleterious Consequence card.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldShowField(fieldId: string, dataVariant: any) {
        if (isEmpty(dataVariant[fieldId])) {
          cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          switch (fieldId) {
            case 'clinvar_classifications':
              dataVariant.clinvar_classifications.forEach((value: string) => {
                const { color, display } = getClass(value);
                cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(value)} ${CommonSelectors.tag(color)}`).should('contain', display);
              });
              break;
            case 'consequence':
              cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              cy.get(`${selectors.mostDeleterious.card} ${dataVariant.consequenceImpact}`).should('exist');
              break;
            default:
              cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              break;
          }
        }
      },
      /**
       * Validates the link of a specific fiel.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldHaveLink(fieldId: string, dataVariant: any) {
        switch (fieldId) {
          case 'transcript_id':
            cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`)
              .find(CommonSelectors.link)
              .should('have.attr', 'href', getUrlLink(fieldId, dataVariant));
            break;
          default:
            cy.get(`${selectors.mostDeleterious.card} ${CommonSelectors.datacy(fieldId)}`).should('have.attr', 'href', getUrlLink(fieldId, dataVariant));
            break;
        }
      },
    },
  },

  interpretation: {
    actions: {
      /**
       * Clicks the link of a specific field to navigate to its destination page within the app.
       * @param fieldId The ID of the field to click.
       */
      clickLink(fieldId: string) {
        switch (fieldId) {
          case 'my_network':
            cy.get(CommonSelectors.datacy(`${fieldId}-link`)).clickAndWait({ force: true });
            break;
          default:
            cy.get(`${selectors.interpretation.card} ${CommonSelectors.datacy(fieldId)}`).clickAndWait({ force: true });
            break;
        }
      },
    },
    validations: {
      /**
       * Validates the content of a specific field in the Interpretation card.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldShowField(fieldId: string, dataVariant: any) {
        if (isEmpty(dataVariant.interpreted.classification)) {
          cy.get(`${selectors.interpretation.card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          switch (fieldId) {
            case 'my_network':
              cy.get(`${selectors.interpretation.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', getClass(dataVariant.interpreted.classification).display);
              break;
            default:
              cy.get(`${selectors.interpretation.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              break;
          }
        }
      },
    },
  },

  classification: {
    validations: {
      /**
       * Validates the content of a specific field in the Classification card.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldShowField(fieldId: string, dataVariant: any) {
        if (isEmpty(dataVariant.acmg_exomiser)) {
          cy.get(`${selectors.classification.card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          switch (fieldId) {
            case 'exomiser':
              dataVariant.acmg_exomiser.forEach((value: string) => {
                cy.get(`${selectors.classification.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', getClass(value).display);
              });
              break;
            default:
              cy.get(`${selectors.classification.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              break;
          }
        }
      },
    },
  },

  predictionScores: {
    actions: {
      /**
       * Opens the "View all" prediction scores modal.
       */
      openViewAll() {
        cy.get(selectors.predictionScores.viewAllButton).click({ force: true });
      },
    },
    validations: {
      /**
       * Validates each prediction score within the card.
       * @param dataVariant The variant object.
       */
      shouldShowScores(dataVariant: any) {
        Object.entries(dataVariant.predictionScores).forEach(([key, value]) => {
          switch (key) {
            case 'loeuf':
            case 'pli':
            case 'revel':
            case 'spliceai':
              cy.get(`${selectors.predictionScores.card} ${CommonSelectors.datacy(value == null ? `${key}-empty` : key)}`).should('contain', getPredictionDisplay(key));
              cy.get(`${selectors.predictionScores.card} ${CommonSelectors.datacy(value == null ? `${key}-empty` : key)}`).should('contain', value == null ? '-' : value);
              break;
            default:
              cy.get(`${selectors.predictionScores.card} ${CommonSelectors.datacy(key)}`).should('not.exist');
              break;
          }
        });
      },
    },
  },

  associatedConditions: {
    validations: {
      /**
       * Validates the content of a specific field in the Associated Conditions card.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldShowField(fieldId: string, dataVariant: any) {
        if (isEmpty(dataVariant[fieldId])) {
          cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          switch (fieldId) {
            case 'omim':
              cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(dataVariant.omim.omim_id)}`).should('contain', dataVariant.omim.condition);
              cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(dataVariant.omim.omim_id)}`).should('contain', dataVariant.omim.inheritance);
              break;
            default:
              cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              break;
          }
        }
      },
      /**
       * Validates the link of a specific field.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldHaveLink(fieldId: string, dataVariant: any) {
        switch (fieldId) {
          case 'omim': {
            const omim = dataVariant.omim;
            cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(`${omim.omim_id}-link`)}`).should('have.attr', 'href', getUrlLink('omim_phenotype', omim));
            break;
          }
          default:
            cy.get(`${selectors.associatedConditions.card} ${CommonSelectors.datacy(fieldId)}`).should('have.attr', 'href', getUrlLink(fieldId, dataVariant));
            break;
        }
      },
    },
  },

  externalReferences: {
    validations: {
      /**
       * Validates the content of a specific field in the External References card.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldShowField(fieldId: string, dataVariant: any) {
        const card = selectors.externalReferences.card;
        if (isEmpty(getUrlLink(fieldId, dataVariant))) {
          cy.get(`${card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          switch (fieldId) {
            case 'clinvar':
            case 'gnomad':
            case 'dbsnp':
              cy.get(`${card} ${CommonSelectors.datacy(fieldId)}`).should('contain', getExternalRefDisplay(fieldId));
              break;
            default:
              cy.get(`${card} ${CommonSelectors.datacy(fieldId)}`).should('contain', dataVariant[fieldId]);
              break;
          }
        }
      },
      /**
       * Validates the link of a specific field.
       * @param fieldId The ID of the field to validate.
       * @param dataVariant The variant object.
       */
      shouldHaveLink(fieldId: string, dataVariant: any) {
        const card = selectors.externalReferences.card;
        const href = getUrlLink(fieldId, dataVariant);
        if (isEmpty(href)) {
          cy.get(`${card} ${CommonSelectors.datacy(fieldId)}`).should('not.exist');
        } else {
          cy.get(`${card} ${CommonSelectors.datacy(fieldId)}`).should('have.attr', 'href', href);
        }
      },
    },
  },
};
