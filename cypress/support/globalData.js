const globalData = {
  Authorization: {
    token: null, // Will be set by initializeGlobalData
  },
  BatchesId: {
    patientSuccess: '2ed3d22a-f110-482a-98ce-1cb7110e6842',
    patientNotFound: '00000000-0000-0000-0000-000000000000',
  },
  Count: {
    //occurrences/germline/snv/{case_id}/{seq_id}/count
    case_id: 1,
    seq_id: 1,
    snv: {
      Variant: [
        {
          field: 'variant_class',
          value: 'SNV',
          op: 'in',
          count: 4000762,
        },
        {
          field: 'consequence',
          value: 'intron_variant',
          op: 'in',
          count: 2737460,
        },
        {
          field: 'chromosome',
          value: '2',
          op: 'in',
          count: 389286,
        },
        {
          field: 'start',
          value: '100000',
          op: '<',
          count: 2591,
        },
      ],
      Gene: [
        {
          field: 'biotype',
          value: 'protein_coding',
          op: 'in',
          count: 2148441,
        },
        {
          field: 'gnomad_pli',
          value: '0.5',
          op: '<',
          count: 1246473,
        },
        {
          field: 'gnomad_loeuf',
          value: '1',
          op: '<',
          count: 1345816,
        },
        {
          field: 'omim_inheritance',
          value: 'Autosomal recessive',
          op: 'in',
          count: 381289,
        },
        {
          field: 'hpo_gene_panel',
          value: 'Autosomal recessive inheritance(HP:0000007)',
          op: 'in',
          count: 425423,
        },
        {
          field: 'orphanet_gene_panel',
          value: 'Autosomal recessive non-syndromic sensorineural deafness type DFNB',
          op: 'in',
          count: 17565,
        },
        {
          field: 'omim_gene_panel',
          value: 'Colorectal cancer, somatic',
          op: 'in',
          count: 6562,
        },
        {
          field: 'ddd_gene_panel',
          value: 'AUTOSOMAL RECESSIVE INTELLECTUAL DEVELOPMENTAL DISORDER',
          op: 'in',
          count: 8434,
        },
        {
          field: 'cosmic_gene_panel',
          value: 'neuroblastoma',
          op: 'in',
          count: 1835,
        },
      ],
      Pathogenicity: [
        {
          field: 'clinvar',
          value: 'Benign',
          op: 'in',
          count: 41344,
        },
        {
          field: 'vep_impact',
          value: 'MODIFIER',
          op: 'in',
          count: 4968294,
        },
        {
          field: 'exomiser_gene_combined_score',
          value: '2.5',
          op: '<',
          count: 16109,
        },
        {
          field: 'exomiser_acmg_classification',
          value: 'uncertain_significance',
          op: 'in',
          count: 12036,
        },
        {
          field: 'exomiser_acmg_evidence',
          value: 'BP4',
          op: 'in',
          count: 7455,
        },
        {
          field: 'cadd_score',
          value: '0.5',
          op: '<',
          count: 12003,
        },
        {
          field: 'cadd_phred',
          value: '25',
          op: '<',
          count: 12564,
        },
        {
          field: 'dann_score',
          value: '0.5',
          op: '<',
          count: 3796,
        },
        {
          field: 'fathmm_pred',
          value: 'T',
          op: 'in',
          count: 9498,
        },
        {
          field: 'lrt_pred',
          value: 'N',
          op: 'in',
          count: 6813,
        },
        {
          field: 'polyphen2_hvar_pred',
          value: 'B',
          op: 'in',
          count: 8265,
        },
        {
          field: 'revel_score',
          value: '0.5',
          op: '<',
          count: 10600,
        },
        {
          field: 'spliceai_ds',
          value: '0.5',
          op: '<',
          count: 3199,
        },
        {
          field: 'sift_pred',
          value: 'T',
          op: 'in',
          count: 8821,
        },
      ],
      Frequency: [
        {
          field: 'pf_wgs',
          value: '0.5',
          op: '<',
          count: 2180139,
        },
        {
          field: 'pf_wgs_affected',
          value: '0.5',
          op: '<',
          count: 2298376,
        },
        {
          field: 'pf_wgs_not_affected',
          value: '0.5',
          op: '<',
          count: 2473724,
        },
        {
          field: 'gnomad_v3_af',
          value: '0.5',
          op: '<',
          count: 2825011,
        },
        {
          field: 'topmed_af',
          value: '0.5',
          op: '<',
          count: 2873043,
        },
        {
          field: 'thousand_genome_af',
          value: '0.5',
          op: '<',
          count: 48018,
        },
      ],
      Occurrence: [
        {
          field: 'zygosity',
          value: 'HET',
          op: 'in',
          count: 3155641,
        },
        {
          field: 'mother_zygosity',
          value: 'HET',
          op: 'in',
          count: 2122449,
        },
        {
          field: 'father_zygosity',
          value: 'HET',
          op: 'in',
          count: 2055200,
        },
        {
          field: 'parental_origin',
          value: 'BOTH',
          op: 'in',
          count: 1764751,
        },
        {
          field: 'transmission_mode',
          value: 'autosomal_dominant',
          op: 'in',
          count: 942035,
        },
        {
          field: 'filter',
          value: 'PASS',
          op: 'in',
          count: 4238849,
        },
        {
          field: 'info_qd',
          value: '20',
          op: '<',
          count: 2170259,
        },
        {
          field: 'ad_alt',
          value: '3500',
          op: '<',
          count: 4973084,
        },
        {
          field: 'ad_total',
          value: '3500',
          op: '<',
          count: 4974267,
        },
        {
          field: 'ad_ratio',
          value: '0.5',
          op: '<',
          count: 1500067,
        },
        {
          field: 'genotype_quality',
          value: '50',
          op: '<',
          count: 216676,
        },
      ],
    },
    cnv: {
      Variant: [
        {
          field: 'type',
          value: 'LOSS',
          op: 'in',
          count: 546,
        },
        {
          field: 'cn',
          value: '100',
          op: '<',
          count: 476,
        },
        {
          field: 'length',
          value: '100000',
          op: '<',
          count: 617,
        },
        {
          field: 'chromosome',
          value: '2',
          op: 'in',
          count: 56,
        },
        {
          field: 'start',
          value: '100000',
          op: '<',
          count: 2,
        },
        {
          field: 'end',
          value: '100000',
          op: '<',
          count: 2,
        },
        {
          field: 'nb_snv',
          value: '10000',
          op: '<',
          count: 521,
        },
      ],
      Gene: [
        {
          field: 'cytoband',
          value: 'p11.2',
          op: 'in',
          count: 33,
        },
        {
          field: 'hpo_gene_panel',
          value: 'Autosomal recessive inheritance(HP:0000007)',
          op: 'in',
          count: 33,
        },
        {
          field: 'orphanet_gene_panel',
          value: 'Retinitis pigmentosa',
          op: 'in',
          count: 3,
        },
        {
          field: 'omim_gene_panel',
          value: 'Albinism, oculocutaneous, type VII',
          op: 'in',
          count: 2,
        },
        {
          field: 'ddd_gene_panel',
          value: 'AUTOSOMAL RECESSIVE INTELLECTUAL DEVELOPMENTAL DISORDER',
          op: 'in',
          count: 2,
        },
        {
          field: 'cosmic_gene_panel',
          value: 'leukaemia',
          op: 'in',
          count: 0,
        },
      ],
      Frequency: [
        {
          field: 'gnomad_sf',
          value: '0.5',
          op: '<',
          count: 153,
        },
        {
          field: 'gnomad_sc',
          value: '10000',
          op: '<',
          count: 66,
        },
      ],
      'Metric QC': [
        {
          field: 'filter',
          value: 'PASS',
          op: 'in',
          count: 138,
        },
        {
          field: 'quality',
          value: '50',
          op: '<',
          count: 432,
        },
        {
          field: 'pe',
          value: '10000',
          op: '<',
          count: 648,
        },
        {
          field: 'sm',
          value: '50',
          op: '<',
          count: 648,
        },
      ],
    },
  },
};

function getGlobalData() {
  return globalData;
}

export default {
  getGlobalData,
  globalData,
};
