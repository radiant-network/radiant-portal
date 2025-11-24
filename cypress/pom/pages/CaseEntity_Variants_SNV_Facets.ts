/// <reference types="cypress"/>
import { CommonTexts } from 'pom/shared/Texts';
import { CommonSelectors } from '../shared/Selectors';
import { getTextOperator } from 'pom/shared/Utils';

const selectors = {
  tab: '[class*= "lucide-audio-waveform"]',
  toggle: '[class*= "h-6 p-2"]:contains("SNV")',
};

export const tableFacets = [
  {
    section: 'Variant',
    facets: [
      {
        id: 'variant_type',
        name: 'Variant Type',
        apiField: 'variant_class',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'consequence',
        name: 'Consequence',
        apiField: 'consequence',
        position: 1,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'chromosome',
        name: 'Chromosome',
        apiField: 'chromosome',
        position: 2,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'position',
        name: 'Position',
        apiField: 'start',
        position: 3,
        tooltip: null,
        defaultOperator: 'between',
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Gene',
    facets: [
      {
        id: 'gene_type',
        name: 'Gene Type',
        apiField: 'biotype',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'gnomad_pli',
        name: 'gnomAD pLI',
        apiField: 'gnomad_pli',
        position: 1,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'gnomad_loeuf',
        name: 'gnomAD LOEUF',
        apiField: 'gnomad_loeuf',
        position: 2,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'omim_inh',
        name: 'OMIM Inheritance',
        apiField: 'omim_inheritance',
        position: 3,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'hpo',
        name: 'HPO',
        apiField: 'hpo_gene_panel',
        position: 4,
        tooltip: 'Human Phenotype Ontology',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'orphanet',
        name: 'Orphanet',
        apiField: 'orphanet_gene_panel',
        position: 5,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'omim',
        name: /^OMIM$/,
        apiField: 'omim_gene_panel',
        position: 6,
        tooltip: 'Online Mendelian Inheritance in Man',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'ddd',
        name: 'DDD',
        apiField: 'ddd_gene_panel',
        position: 7,
        tooltip: 'Deciphering Developmental Disorders',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'cosmic',
        name: 'COSMIC',
        apiField: 'cosmic_gene_panel',
        position: 8,
        tooltip: 'Catalogue Of Somatic Mutations In Cancer',
        defaultOperator: null,
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Pathogenicity',
    facets: [
      {
        id: 'clinvar',
        name: 'ClinVar',
        apiField: 'clinvar',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'vep',
        name: 'VEP',
        apiField: 'vep_impact',
        position: 1,
        tooltip: 'Ensembl Variant Effect Predictor',
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'exo_score',
        name: 'Exomiser Score',
        apiField: 'exomiser_gene_combined_score',
        position: 2,
        tooltip: 'Exomiser score based on variant properties and patient phenotypes',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'exo_acmg',
        name: 'Exomiser ACMG',
        apiField: 'exomiser_acmg_classification',
        position: 3,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'exo_acmg_evi',
        name: 'Exomiser ACMG Evidences',
        apiField: 'exomiser_acmg_evidence',
        position: 4,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'cadd_raw',
        name: 'CADD (Raw)',
        apiField: 'cadd_score',
        position: 5,
        tooltip: 'Combined Annotation Dependent Depletion',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'cadd_phred',
        name: 'CADD (Phred)',
        apiField: 'cadd_phred',
        position: 6,
        tooltip: 'Combined Annotation Dependent Depletion PHRED',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'dann',
        name: 'DANN',
        apiField: 'dann_score',
        position: 7,
        tooltip: 'Deleterious Annotation of genetic variants using Neural Networks',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'fathmm',
        name: 'FATHMM',
        apiField: 'fathmm_pred',
        position: 8,
        tooltip: 'Functional Analysis Through Hidden Markov Models',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'lrt',
        name: 'LRT',
        apiField: 'lrt_pred',
        position: 9,
        tooltip: 'Likelihood Ratio Test',
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'polyphen',
        name: 'PolyPhen-2 HVAR',
        apiField: 'polyphen2_hvar_pred',
        position: 10,
        tooltip: 'Polymorphism Phenotyping v2 HumVar',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'revel',
        name: 'REVEL',
        apiField: 'revel_score',
        position: 11,
        tooltip: 'Rare Exome Variant Ensemble Learner',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'spliceai',
        name: 'SpliceAI',
        apiField: 'spliceai_ds',
        position: 12,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'sift',
        name: 'SIFT',
        apiField: 'sift_pred',
        position: 13,
        tooltip: 'Sorting Intolerant From Tolerant',
        defaultOperator: null,
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Frequency',
    facets: [
      {
        id: 'all_patient_freq',
        name: 'All Patient Freq.',
        apiField: 'pf_wgs',
        position: 0,
        tooltip: 'All Patient Frequency (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'aff_patient_freq',
        name: 'Affected Patient Freq.',
        apiField: 'pf_wgs_affected',
        position: 1,
        tooltip: 'Affected Patient Frequency (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'unaff_patient_freq',
        name: 'Non-Affected Patient Freq.',
        apiField: 'pf_wgs_not_affected',
        position: 2,
        tooltip: 'Non-affected Patient Frequency (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'gnomad_genome_312',
        name: 'gnomAD Genome 3.1.2',
        apiField: 'gnomad_v3_af',
        position: 3,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'topmed',
        name: 'TopMed',
        apiField: 'topmed_af',
        position: 4,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: '1000_genomes',
        name: '1000 Genomes',
        apiField: 'thousand_genome_af',
        position: 5,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
    ],
  },
  {
    section: 'Occurrence',
    facets: [
      {
        id: 'zygosity',
        name: 'Zygosity',
        apiField: 'zygosity',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'mth_zygosity',
        name: `Mother’s Zygosity`,
        apiField: 'mother_zygosity',
        position: 1,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'fth_zygosity',
        name: `Father’s Zygosity`,
        apiField: 'father_zygosity',
        position: 2,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'parental_origin',
        name: 'Parental Origin',
        apiField: 'parental_origin',
        position: 3,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'transmission',
        name: 'Transmission',
        apiField: 'transmission_mode',
        position: 4,
        tooltip: 'Mode of inheritance in the family',
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'filter',
        name: 'Filter',
        apiField: 'filter',
        position: 5,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'quality_depth',
        name: 'Quality Depth',
        apiField: 'info_qd',
        position: 6,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'alt_depth',
        name: 'ALT Allele Depth',
        apiField: 'ad_alt',
        position: 7,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'total_depth',
        name: 'Total Depth ALT + REF',
        apiField: 'ad_total',
        position: 8,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'ratio_alt',
        name: 'Allelic Ratio ALT',
        apiField: 'ad_ratio',
        position: 9,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'genotype_quality',
        name: 'Genotype Quality',
        apiField: 'genotype_quality',
        position: 10,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
    ],
  },
];

export const CaseEntity_Variants_SNV_Facets = {
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
     * @param section The section name to open (e.g., 'Variant', 'Gene', 'Pathogenicity').
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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);

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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);

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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);
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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);
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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);
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
        CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section.section);

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
     * @param section - The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
     * @param facet - The facet ID to test (e.g., 'variant_type', 'consequence').
     * @throws Error if the section or facet is not found in tableFacets configuration.
     */
    shouldRequestOnApply(section: string, facet: string) {
      CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section);
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
     * @param section - The section name to validate (e.g., 'Variant', 'Gene', 'Pathogenicity').
     * @throws Error if the section is not found in tableFacets configuration.
     */
    shouldShowAllFacets(section: string) {
      CaseEntity_Variants_SNV_Facets.actions.clickSidebarSection(section);
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
