/// <reference types="cypress"/>
import { CommonTexts } from 'pom/shared/Texts';
import { CommonSelectors } from '../shared/Selectors';
import { getTextOperator } from 'pom/shared/Utils';

export const tableFacets = [
  {
    section: 'Variant',
    facets: [
      {
        id: 'variant_type',
        name: 'Variant Type',
        apiField: 'type',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'copy_number',
        name: 'Copy Number',
        apiField: 'cn',
        position: 1,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'size',
        name: 'CNV Size',
        apiField: 'length',
        position: 2,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'chromosome',
        name: 'Chromosome',
        apiField: 'chromosome',
        position: 3,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'start',
        name: 'CNV Start',
        apiField: 'start',
        position: 4,
        tooltip: null,
        defaultOperator: 'between',
        hasDictionary: false,
      },
      {
        id: 'end',
        name: 'CNV End',
        apiField: 'end',
        position: 5,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'snvs_count',
        name: 'SNVs Count',
        apiField: 'nb_snv',
        position: 6,
        tooltip: 'Number of SNVs included in the CNV',
        defaultOperator: '>',
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Gene',
    facets: [
      {
        id: 'cytoband',
        name: 'Cytoband',
        apiField: 'cytoband',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'hpo',
        name: 'HPO',
        apiField: 'hpo_gene_panel',
        position: 1,
        tooltip: 'Human Phenotype Ontology',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'orphanet',
        name: 'Orphanet',
        apiField: 'orphanet_gene_panel',
        position: 2,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'omim',
        name: 'OMIM',
        apiField: 'omim_gene_panel',
        position: 3,
        tooltip: 'Online Mendelian Inheritance in Man',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'ddd',
        name: 'DDD',
        apiField: 'ddd_gene_panel',
        position: 4,
        tooltip: 'Deciphering Developmental Disorders',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'cosmic',
        name: 'COSMIC',
        apiField: 'cosmic_gene_panel',
        position: 5,
        tooltip: 'Catalogue Of Somatic Mutations In Cancer',
        defaultOperator: null,
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Frequency',
    facets: [
      {
        id: 'gnomad_410',
        name: /^gnomAD 4.1.0$/,
        apiField: 'gnomad_sf',
        position: 0,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'gnomad_410_alt',
        name: 'gnomAD 4.1.0 ALT',
        apiField: 'gnomad_sc',
        position: 1,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Metric QC',
    facets: [
      {
        id: 'filter',
        name: 'Filter',
        apiField: 'filter',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'cnv_quality',
        name: 'CNV Quality',
        apiField: 'quality',
        position: 1,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'pe',
        name: 'PE',
        apiField: 'pe',
        position: 2,
        tooltip: 'Number of improperly paired end reads at start and stop breakpoints',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'sm',
        name: 'SM',
        apiField: 'sm',
        position: 3,
        tooltip: 'Linear copy ratio of the segment mean',
        defaultOperator: '<',
        hasDictionary: false,
      },
    ],
  },
];

export const CaseEntity_Variants_CNV_Facets = {
  actions: {
    /**
     * Clicks the collapse all button to collapse all facets.
     */
    clickCollapseAllButton() {
      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.collapseAll)).clickAndWait({ force: true });
    },
    /**
     * Clicks the expand all button to expand all facets.
     */
    clickExpandAllButton() {
      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });
    },
    /**
     * Clicks the sidebar section to display its facets.
     * @param section The section name to open (e.g., 'Variant', 'Gene', 'Frequency').
     */
    clickSidebarSection(section: string) {
      cy.get(CommonSelectors.sidebarSection(section)).clickAndWait({ force: true });
    },
  },

  validations: {
    /**
     * Validates that dictionary additional values have zero count.
     */
    shouldDictionaryAdditionalValuesHaveZeroCount() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);

        section.facets.forEach(facet => {
          if (facet.hasDictionary) {
            cy.intercept('POST', '**/aggregate?with_dictionary=false', req => {
              if (req.body.field.includes(facet.apiField)) {
                req.alias = 'postDicFalse';
              }
            });
            cy.get(CommonSelectors.facetHeader).eq(facet.position).contains(facet.name).click({ force: true });
            cy.wait('@postDicFalse').then(interceptWithoutDict => {
              const responseWithoutDict = interceptWithoutDict.response?.body;

              cy.intercept('POST', '**/aggregate?with_dictionary=true', req => {
                if (req.body.field.includes(facet.apiField)) {
                  req.alias = 'postDicTrue';
                }
              });
              cy.get(CommonSelectors.facetHeader).contains(facet.name).parents(CommonSelectors.facet).find(CommonSelectors.facetDictionaryButton).click({ force: true });
              cy.wait('@postDicTrue').then(interceptWithDict => {
                const responseWithDict = interceptWithDict.response?.body;

                const valuesWithoutDict = responseWithoutDict.map((item: any) => item.key);
                const dictionaryOnlyValues = responseWithDict.filter((item: any) => !valuesWithoutDict.includes(item.key));

                dictionaryOnlyValues.forEach((item: any) => {
                  expect(item.count, `${facet.name}: "${item.key}" should have count = 0`).to.eq(0);
                });
              });
            });
          }
        });
      });
    },
    /**
     * Validates that dictionary api responses include all non-zero values from non-dictionary api responses.
     */
    shouldDictionaryIncludeAllNonZeroValues() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);

        section.facets.forEach(facet => {
          if (facet.hasDictionary) {
            cy.intercept('POST', '**/aggregate?with_dictionary=false', req => {
              if (req.body.field.includes(facet.apiField)) {
                req.alias = 'postDicFalse';
              }
            });
            cy.get(CommonSelectors.facetHeader).eq(facet.position).contains(facet.name).click({ force: true });
            cy.wait('@postDicFalse').then(interceptWithoutDict => {
              const responseWithoutDict = interceptWithoutDict.response?.body;

              cy.intercept('POST', '**/aggregate?with_dictionary=true', req => {
                if (req.body.field.includes(facet.apiField)) {
                  req.alias = 'postDicTrue';
                }
              });
              cy.get(CommonSelectors.facetHeader).contains(facet.name).parents(CommonSelectors.facet).find(CommonSelectors.facetDictionaryButton).click({ force: true });
              cy.wait('@postDicTrue').then(interceptWithDict => {
                const responseWithDict = interceptWithDict.response?.body;

                const valuesWithoutDict = responseWithoutDict.map((item: any) => item.key);
                const valuesWithDict = responseWithDict.map((item: any) => item.key);

                valuesWithoutDict.forEach((key: string) => {
                  const countWithoutDict = responseWithoutDict.find((item: any) => item.key === key)?.count;
                  const countWithDict = responseWithDict.find((item: any) => item.key === key)?.count;
                  expect(valuesWithDict, `${facet.name}: key "${key}" should be in dictionary response`).to.include(key);
                  expect(countWithDict, `${facet.name}: count for "${key}" should match`).to.eq(countWithoutDict);
                });
              });
            });
          }
        });
      });
    },
    /**
     * Validates that facets have or do not have a dictionary based on their configuration.
     * Iterates through all sections and checks each facet's dictionary presence.
     */
    shouldHaveDictionary() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);
        cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

        section.facets.forEach(facet => {
          const expectedExist = facet.hasDictionary ? 'exist' : 'not.exist';
          cy.get(CommonSelectors.facetHeader).contains(facet.name).parents(CommonSelectors.facet).find(CommonSelectors.facetDictionaryButton).should(expectedExist);
        });
      });
    },
    /**
     * Validates that facets display tooltips when expected.
     * Iterates through all sections and checks each facet's tooltip presence.
     */
    shouldHaveTooltip() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);
        cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

        section.facets.forEach(facet => {
          cy.get(CommonSelectors.facetHeader).contains(facet.name).shouldHaveTooltip(facet);
        });
      });
    },
    /**
     * Validates that numerical facets have the correct default operator.
     * Only validates facets with a non-null defaultOperator value.
     */
    shouldNumericalHaveDefaultOperator() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);
        cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

        section.facets.forEach(facet => {
          if (facet.defaultOperator !== null) {
            cy.get(CommonSelectors.facetOperator(facet.apiField)).contains(getTextOperator(facet.defaultOperator)).should('exist');
          }
        });
      });
    },
    /**
     * Validates that facets can be expanded and collapsed correctly.
     * Tests both expand all and collapse all functionality for all sections.
     */
    shouldExpandAndCollapse() {
      tableFacets.forEach(section => {
        CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section.section);

        cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });
        cy.get(`${CommonSelectors.facetState('open')} ${CommonSelectors.facetHeader}`).should('exist');
        cy.get(`${CommonSelectors.facetState('closed')} ${CommonSelectors.facetHeader}`).should('not.exist');

        cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.collapseAll)).clickAndWait({ force: true });
        cy.get(`${CommonSelectors.facetState('closed')} ${CommonSelectors.facetHeader}`).should('exist');
        cy.get(`${CommonSelectors.facetState('open')} ${CommonSelectors.facetHeader}`).should('not.exist');
      });
    },
    /**
     * Validates the request body sent to the API when applying a facet filter.
     * Compares the intercepted request with the expected fixture data.
     * @param section - The section name (e.g., 'Variant', 'Gene', 'Frequency').
     * @param facet - The facet ID to test (e.g., 'variant_type', 'copy_number').
     * @throws Error if the section or facet is not found in tableFacets configuration.
     */
    shouldRequestOnApply(section: string, facet: string) {
      CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section);
      const sectionData = tableFacets.find(s => s.section === section);

      if (!sectionData) {
        throw new Error(`Section "${section}" not found in tableFacets`);
      }
      const facetData = sectionData.facets.find(f => f.id === facet);

      if (!facetData) {
        throw new Error(`Facet "${facet}" not found in tableFacets section ${section}`);
      }

      let opWithData = facetData.defaultOperator ? facetData.defaultOperator : '';
      cy.get(CommonSelectors.facetHeader).contains(facetData.name).clickAndWait({ force: true });

      if (!facetData.defaultOperator) {
        cy.get(CommonSelectors.facetHeader).contains(facetData.name).parents(CommonSelectors.facet).find(CommonSelectors.facetCheckbox('')).eq(0).click({ force: true });
        opWithData = 'in';
      }

      cy.intercept('POST', '**/count').as('postCount');
      cy.get(CommonSelectors.facetHeader).contains(facetData.name).parents(CommonSelectors.facet).find(CommonSelectors.facetApplyButton).click({ force: true });

      cy.wait('@postCount').then(interception => {
        cy.fixture('RequestBody/ApplyFacet.json').then(fixture => {
          const fixtureWithData = JSON.parse(JSON.stringify(fixture).replace('_FIELD', facetData.apiField).replace('_OP', opWithData));
          const interceptionWithData = { ...interception.request.body };
          interceptionWithData.sqon.content[0].content.value = ['_VALUE'];

          expect(interceptionWithData).to.deep.equal(fixtureWithData);
        });
      });
    },

    /**
     * Validates that all facets in a section are displayed in the correct order.
     * @param section - The section name to validate (e.g., 'Variant', 'Gene', 'Frequency').
     * @throws Error if the section is not found in tableFacets configuration.
     */
    shouldShowAllFacets(section: string) {
      CaseEntity_Variants_CNV_Facets.actions.clickSidebarSection(section);
      const sectionData = tableFacets.find(s => s.section === section);

      if (!sectionData) {
        throw new Error(`Section "${section}" not found in tableFacets`);
      }

      sectionData.facets.forEach(facet => {
        cy.get(CommonSelectors.facetHeader).eq(facet.position).contains(facet.name).should('exist');
      });
    },
  },
};
