/// <reference types="cypress"/>
import { CommonTexts } from 'pom/shared/Texts';
import { CommonSelectors } from '../shared/Selectors';
import { buildBilingualRegExp, findFacetData, findSectionData, getTextOperator } from 'pom/shared/Utils';

export const tableSNVFacets = [
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
        apiField: 'germline_pf_wgs',
        position: 0,
        tooltip: 'Frequency across all patients of the network (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'aff_patient_freq',
        name: 'Affected Patient Freq.',
        apiField: 'germline_pf_wgs_affected',
        position: 1,
        tooltip: 'Frequency across affected patients of the network (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'unaff_patient_freq',
        name: 'Non-Affected Patient Freq.',
        apiField: 'germline_pf_wgs_not_affected',
        position: 2,
        tooltip: 'Frequency across non-affected patients of the network (WGS)',
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
        tooltip: 'Indicator of the possible relationship between the genetics dominance of the variant and its parental origin.',
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

export const tableCNVFacets = [
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
        hasDictionary: true,
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
        hasDictionary: true,
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

export const tableSomaticFacets = [
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
        id: 'cadd_raw',
        name: 'CADD (Raw)',
        apiField: 'cadd_score',
        position: 2,
        tooltip: 'Combined Annotation Dependent Depletion',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'cadd_phred',
        name: 'CADD (Phred)',
        apiField: 'cadd_phred',
        position: 3,
        tooltip: 'Combined Annotation Dependent Depletion PHRED',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'dann',
        name: 'DANN',
        apiField: 'dann_score',
        position: 4,
        tooltip: 'Deleterious Annotation of genetic variants using Neural Networks',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'fathmm',
        name: 'FATHMM',
        apiField: 'fathmm_pred',
        position: 5,
        tooltip: 'Functional Analysis Through Hidden Markov Models',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'lrt',
        name: 'LRT',
        apiField: 'lrt_pred',
        position: 6,
        tooltip: 'Likelihood Ratio Test',
        defaultOperator: null,
        hasDictionary: true,
      },
      {
        id: 'polyphen',
        name: 'PolyPhen-2 HVAR',
        apiField: 'polyphen2_hvar_pred',
        position: 7,
        tooltip: 'Polymorphism Phenotyping v2 HumVar',
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'revel',
        name: 'REVEL',
        apiField: 'revel_score',
        position: 8,
        tooltip: 'Rare Exome Variant Ensemble Learner',
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'spliceai',
        name: 'SpliceAI',
        apiField: 'spliceai_ds',
        position: 9,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'sift',
        name: 'SIFT',
        apiField: 'sift_pred',
        position: 10,
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
        id: 'somatic_tn_freq',
        name: 'Freq. TN All Patients',
        apiField: 'somatic_pf_tn_wgs',
        position: 0,
        tooltip: 'Frequency across all patients of the network who had a tumor-normal analysis (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'all_patient_freq',
        name: 'All Patient Freq.',
        apiField: 'germline_pf_wgs',
        position: 1,
        tooltip: 'Frequency across all patients of the network (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'aff_patient_freq',
        name: 'Affected Patient Freq.',
        apiField: 'germline_pf_wgs_affected',
        position: 2,
        tooltip: 'Frequency across affected patients of the network (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'unaff_patient_freq',
        name: 'Non-Affected Patient Freq.',
        apiField: 'germline_pf_wgs_not_affected',
        position: 3,
        tooltip: 'Frequency across non-affected patients of the network (WGS)',
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'gnomad_genome_312',
        name: 'gnomAD Genome 3.1.2',
        apiField: 'gnomad_v3_af',
        position: 4,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: 'topmed',
        name: 'TopMed',
        apiField: 'topmed_af',
        position: 5,
        tooltip: null,
        defaultOperator: '<',
        hasDictionary: false,
      },
      {
        id: '1000_genomes',
        name: '1000 Genomes',
        apiField: 'thousand_genome_af',
        position: 6,
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
        id: 'filter',
        name: 'Filter',
        apiField: 'filter',
        position: 0,
        tooltip: null,
        defaultOperator: null,
        hasDictionary: false,
      },
      {
        id: 'quality_depth',
        name: 'Quality Depth',
        apiField: 'info_qd',
        position: 1,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'alt_depth',
        name: 'ALT Allele Depth',
        apiField: 'ad_alt',
        position: 2,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'total_depth',
        name: 'Total Depth ALT + REF',
        apiField: 'ad_total',
        position: 3,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
      {
        id: 'ratio_alt',
        name: 'Allelic Ratio ALT',
        apiField: 'ad_ratio',
        position: 4,
        tooltip: null,
        defaultOperator: '>',
        hasDictionary: false,
      },
    ],
  },
];

const generateFacetsActionsFunctions = (tableFacets: any[] = []) => ({
  /**
   * Applies a multiselect facet filter by selecting its first value and clicking apply.
   * @param section The section name to open (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The multiselect facet id to apply (e.g., 'chromosome', 'variant_type').
   */
  applyMultiselectFacetFilter(section: string, facet: string) {
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.sidebarSection(section)).clickAndWait({ force: true });
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, /*any value*/ '')).eq(0).click({ force: true });
    cy.get(CommonSelectors.facetApplyButton(facetData.apiField)).clickAndWait({ force: true });
  },
  /**
   * Applies a numerical facet filter by filling its input(s) with `1` and clicking apply.
   * A `between` facet is filled with min = max = 1.
   * @param section The section name to open (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The numerical facet id to apply (e.g., 'position', 'start').
   */
  applyNumericalFacetFilter(section: string, facet: string) {
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.sidebarSection(section)).clickAndWait({ force: true });
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });
    if (facetData.defaultOperator === 'between') {
      cy.get(CommonSelectors.facetMinInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
      cy.get(CommonSelectors.facetMaxInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
    } else {
      cy.get(CommonSelectors.facetValueInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
    }
    cy.get(CommonSelectors.facetApplyButton(facetData.apiField)).clickAndWait({ force: true });
  },
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
  /**
   * Opens the upload-list modal.
   */
  openUploadListModal() {
    cy.get(CommonSelectors.uploadListButton).clickAndWait({ force: true });
  },
  /**
   * Types a gene in the search autocomplete and selects the matching suggestion.
   * @param gene The gene symbol or Ensembl ID to search (e.g., 'HPSE2').
   */
  searchGene(gene: string) {
    cy.intercept('GET', '**/genes/autocomplete*').as('getGeneAutocomplete');
    cy.intercept('POST', '**/list').as('postListSearchBy');
    cy.get(`${CommonSelectors.searchFacet} ${CommonSelectors.input}`).type(gene, { force: true });
    cy.wait('@getGeneAutocomplete');
    cy.get(`${CommonSelectors.searchFacet} ${CommonSelectors.commandItem}`).contains(gene).clickAndWait({ force: true });
    cy.wait('@postListSearchBy');
  },
});

const generateFacetsValidationsFunctions = (tableFacets: any[], clickSidebarSectionAction: (section: string) => void) => ({
  /**
   * Validates that dictionary additional values have zero count.
   */
  shouldDictionaryAdditionalValuesHaveZeroCount() {
    tableFacets.forEach(section => {
      clickSidebarSectionAction(section.section);

      section.facets.forEach((facet: any) => {
        if (facet.hasDictionary) {
          cy.intercept('POST', '**/aggregate?with_dictionary=false', req => {
            if (req.body.field.includes(facet.apiField)) {
              req.alias = 'postDicFalse';
            }
          });
          cy.get(CommonSelectors.facetHeader(facet.apiField)).click({ force: true });
          cy.wait('@postDicFalse').then(interceptWithoutDict => {
            const responseWithoutDict = interceptWithoutDict.response?.body;

            cy.intercept('POST', '**/aggregate?with_dictionary=true', req => {
              if (req.body.field.includes(facet.apiField)) {
                req.alias = 'postDicTrue';
              }
            });
            cy.get(CommonSelectors.facetDictionaryButton(facet.apiField)).click({ force: true });
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
      clickSidebarSectionAction(section.section);

      section.facets.forEach((facet: any) => {
        if (facet.hasDictionary) {
          cy.intercept('POST', '**/aggregate?with_dictionary=false', req => {
            if (req.body.field.includes(facet.apiField)) {
              req.alias = 'postDicFalse';
            }
          });
          cy.get(CommonSelectors.facetHeader(facet.apiField)).click({ force: true });
          cy.wait('@postDicFalse').then(interceptWithoutDict => {
            const responseWithoutDict = interceptWithoutDict.response?.body;

            cy.intercept('POST', '**/aggregate?with_dictionary=true', req => {
              if (req.body.field.includes(facet.apiField)) {
                req.alias = 'postDicTrue';
              }
            });
            cy.get(CommonSelectors.facetDictionaryButton(facet.apiField)).click({ force: true });
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
      clickSidebarSectionAction(section.section);
      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

      section.facets.forEach((facet: any) => {
        const expectedExist = facet.hasDictionary ? 'exist' : 'not.exist';
        cy.get(CommonSelectors.facetDictionaryButton(facet.apiField)).should(expectedExist);
      });
    });
  },
  /**
   * Validates that the applied filter produced a `symbol` (Gene Symbol) query pill.
   * @param genes The gene symbols expected in the pill (compared lowercase, as rendered by the query builder).
   */
  shouldHaveGeneSymbolPill(genes: string[]) {
    cy.validatePillSelectedQuery(
      'Gene Symbol',
      genes.map(gene => gene.toLowerCase())
    );
  },
  /**
   * Validates that facets display tooltips when expected.
   * Iterates through all sections and checks each facet's tooltip presence.
   */
  shouldHaveTooltip() {
    tableFacets.forEach(section => {
      clickSidebarSectionAction(section.section);
      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

      section.facets.forEach((facet: any) => {
        cy.get(CommonSelectors.facetHeader(facet.apiField)).shouldHaveTooltip(facet);
      });
    });
  },
  /**
   * Validates that numerical facets have the correct default operator.
   * Only validates facets with a non-null defaultOperator value.
   */
  shouldNumericalHaveDefaultOperator() {
    tableFacets.forEach(section => {
      clickSidebarSectionAction(section.section);
      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });

      section.facets.forEach((facet: any) => {
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
      clickSidebarSectionAction(section.section);

      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.expandAll)).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.facetState('open')} ${CommonSelectors.facetHeader('' /*all facets*/)}`).should('exist');
      cy.get(`${CommonSelectors.facetState('closed')} ${CommonSelectors.facetHeader('' /*all facets*/)}`).should('not.exist');

      cy.get(CommonSelectors.expandCollapseButton(CommonTexts.en.collapseAll)).clickAndWait({ force: true });
      cy.get(`${CommonSelectors.facetState('closed')} ${CommonSelectors.facetHeader('' /*all facets*/)}`).should('exist');
      cy.get(`${CommonSelectors.facetState('open')} ${CommonSelectors.facetHeader('' /*all facets*/)}`).should('not.exist');
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
    clickSidebarSectionAction(section);
    const facetData = findFacetData(tableFacets, section, facet);

    let opWithData = facetData.defaultOperator ? facetData.defaultOperator : '';
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });

    if (!facetData.defaultOperator) {
      cy.get(CommonSelectors.facetCheckbox(facetData.apiField, /*any value*/ '')).eq(0).click({ force: true });
      opWithData = 'in';
    } else if (facetData.defaultOperator === 'between') {
      cy.get(CommonSelectors.facetMinInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
      cy.get(CommonSelectors.facetMaxInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
    } else {
      cy.get(CommonSelectors.facetValueInput(facetData.apiField)).clear({ force: true }).type('1', { force: true });
    }

    cy.intercept('POST', '**/count').as('postCount');
    cy.get(CommonSelectors.facetApplyButton(facetData.apiField)).click({ force: true });

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
   * Validates that the clear (reset) button unselects the facet values.
   * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The facet id to test (e.g., 'chromosome', 'variant_type').
   */
  shouldResetFacet(section: string, facet: string) {
    clickSidebarSectionAction(section);
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });

    cy.get(CommonSelectors.facetClearButton(facetData.apiField)).should('be.disabled');
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, /*any value*/ '')).eq(0).click({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).eq(0).shouldBeDataState('checked');

    cy.get(CommonSelectors.facetClearButton(facetData.apiField)).should('be.enabled').click({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).eq(0).shouldBeDataState('unchecked');
    cy.get(CommonSelectors.facetClearButton(facetData.apiField)).should('be.disabled');
  },
  /**
   * Validates the intra-facet search: a matching term keeps the value visible,
   * a non-matching term shows the empty state, and clearing restores the values.
   * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The facet id to test (e.g., 'chromosome', 'variant_type').
   */
  shouldSearchInFacet(section: string, facet: string) {
    clickSidebarSectionAction(section);
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });

    // A matching term keeps the searched value visible (data-cy encodes the value key)
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, ''))
      .first()
      .invoke('attr', 'data-cy')
      .then(dataCy => {
        const value = (dataCy ?? '').replace(`facet-checkbox-${facetData.apiField}-`, '');
        cy.get(CommonSelectors.facetSearchInput(facetData.apiField)).clear({ force: true }).type(value, { force: true });
        cy.get(CommonSelectors.facetCheckbox(facetData.apiField, value)).should('exist');
      });

    // A non-matching term shows the empty state (no checkbox rendered)
    cy.get(CommonSelectors.facetSearchInput(facetData.apiField)).clear({ force: true }).type('noMatchValue', { force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).should('not.exist');

    // Clearing the search restores the values
    cy.get(CommonSelectors.facetSearchInput(facetData.apiField)).clear({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).should('exist');
  },
  /**
   * Validates the select all / none buttons: 'All' checks every visible value,
   * 'None' unchecks them.
   * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The facet id to test (e.g., 'chromosome', 'variant_type').
   */
  shouldSelectAllAndNone(section: string, facet: string) {
    clickSidebarSectionAction(section);
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });

    cy.get(CommonSelectors.facetSelectAll(facetData.apiField)).click({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).each($checkbox => cy.wrap($checkbox).shouldBeDataState('checked'));

    cy.get(CommonSelectors.facetSelectNone(facetData.apiField)).click({ force: true });
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).each($checkbox => cy.wrap($checkbox).shouldBeDataState('unchecked'));
  },
  /**
   * Validates the show more / show less toggle: 'show more' reveals additional values,
   * 'show less' collapses back to the default visible count.
   * Applicable only to facets rendering more than the default visible items.
   * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @param facet The facet id to test (e.g., 'chromosome', 'consequence').
   */
  shouldShowMoreAndLess(section: string, facet: string) {
    clickSidebarSectionAction(section);
    const facetData = findFacetData(tableFacets, section, facet);
    cy.get(CommonSelectors.facetHeader(facetData.apiField)).clickAndWait({ force: true });

    cy.get(CommonSelectors.facetShowMore(facetData.apiField)).should('exist');
    cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).then($visible => {
      const visibleCount = $visible.length;
      cy.get(CommonSelectors.facetShowMore(facetData.apiField)).click({ force: true });
      cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).its('length').should('be.gt', visibleCount);

      cy.get(CommonSelectors.facetShowLess(facetData.apiField)).should('exist').click({ force: true });
      cy.get(CommonSelectors.facetCheckbox(facetData.apiField, '')).its('length').should('eq', visibleCount);
    });
  },
  /**
   * SEARCH_BY facet: validates that the search facet displays its tooltip on hover.
   * @param field The search facet field key (default: 'symbol' for `search_by_symbol`).
   */
  shouldSearchByHaveTooltip(field: string = 'symbol') {
    cy.get(CommonSelectors.searchFacetTooltip(field)).realHover();
    cy.get(CommonSelectors.searchFacetTooltipContent(field)).contains(buildBilingualRegExp('searchByGeneTooltip')).should('exist');
  },
  /**
   * Validates that all facets in a section are displayed in the correct order.
   * @param section - The section name to validate (e.g., 'Variant', 'Gene', 'Pathogenicity').
   * @throws Error if the section is not found in tableFacets configuration.
   */
  shouldShowAllFacets(section: string) {
    clickSidebarSectionAction(section);
    const sectionData = findSectionData(tableFacets, section);

    sectionData.facets.forEach((facet: any) => {
      cy.get(CommonSelectors.facetHeader('' /*all facets*/)).eq(facet.position).should('match', CommonSelectors.facetHeader(facet.apiField));
    });
  },
});

export const CaseEntity_Variants_Facets = {
  snv: {
    actions: generateFacetsActionsFunctions(tableSNVFacets),
    validations: (() => {
      const actions = generateFacetsActionsFunctions(tableSNVFacets);
      const baseValidations = generateFacetsValidationsFunctions(tableSNVFacets, actions.clickSidebarSection);
      return {
        ...baseValidations,
      };
    })(),
  },
  cnv: {
    actions: generateFacetsActionsFunctions(tableCNVFacets),
    validations: (() => {
      const actions = generateFacetsActionsFunctions(tableCNVFacets);
      const baseValidations = generateFacetsValidationsFunctions(tableCNVFacets, actions.clickSidebarSection);
      return {
        ...baseValidations,
      };
    })(),
  },
  somatic: {
    actions: generateFacetsActionsFunctions(tableSomaticFacets),
    validations: (() => {
      const actions = generateFacetsActionsFunctions(tableSomaticFacets);
      const baseValidations = generateFacetsValidationsFunctions(tableSomaticFacets, actions.clickSidebarSection);
      return {
        ...baseValidations,
      };
    })(),
  },
};
