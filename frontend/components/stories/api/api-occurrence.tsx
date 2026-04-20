import { HttpResponse } from 'msw';

import { generateBooleanData, generateMultiSelectData, generateSortedAdvancedData } from '../table/table-mock';

export const occurrenceListApi = `api/occurrences/germline/:type/:case_id/:seq_id/list`;
export const occurrenceAggregateApi = `api/occurrences/germline/:type/:case_id/:seq_id/aggregate`;
export const occurrenceAggregateStatisticApi = `api/occurrences/germline/:type/:case_id/:seq_id/statistics`;
export const occurrenceGermlineExpandApi = `api/occurrences/germline/:type/:case_id/:seq_id/:locus_id/expanded`;
export const occurrenceSomaticExpandApi = `api/occurrences/somatic/:type/:case_id/:seq_id/:locus_id/expanded`;

export type OccurenceHandler = {
  case_id: string;
  seq_id: string;
};

export async function httpOccurrenceAggregateApiResponse({ request }: any) {
  const body = await request.clone().json();
  const url = new URL(request.url);
  const dictionary = url.searchParams.get('with_dictionary');

  if (body.field.includes('boolean')) {
    return HttpResponse.json([
      {
        key: 'true',
        count: 10,
      },
      {
        key: 'false',
        count: 5,
      },
    ]);
  }

  if (body.field.includes('isActive')) {
    return HttpResponse.json(generateBooleanData('isActive'));
  } else if (body.field.includes('newsletterSubscribed')) {
    return HttpResponse.json(generateBooleanData('newsletterSubscribed'));
  }

  let multiSelectResponse: any[] = [];
  if (body.field.includes('firstName')) {
    multiSelectResponse = generateMultiSelectData('firstName');
  } else if (body.field.includes('lastName')) {
    multiSelectResponse = generateMultiSelectData('lastName');
  } else if (body.field.includes('status')) {
    multiSelectResponse = generateMultiSelectData('status');
    if (dictionary && dictionary === 'true') {
      multiSelectResponse.push({
        key: 'unknown',
        count: 0,
      });
    }
  } else {
    multiSelectResponse = [
      {
        key: 'lorem_ipsum',
        count: 2,
      },
      {
        key: 'id_finibus',
        count: 18,
      },
      {
        key: 'iaculis',
        count: 39,
      },
      {
        key: 'etiam_pharetra_ornare_porttitor',
        count: 41,
      },
      {
        key: 'vivamus_non_facilisis_purus',
        count: 52,
      },
      {
        key: 'proin_eu_felis_eu_arcu_varius_mattis',
        count: 77,
      },
      {
        key: 'lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit',
        count: 191,
      },
    ];
    if (dictionary && dictionary == 'true') {
      multiSelectResponse.push({
        key: 'dictionary',
        count: 0,
      });
    }
  }

  return HttpResponse.json(multiSelectResponse);
}

export async function httpOccurrenceAggregateStatisticsApiResponse({ request }: any) {
  const body = await request.clone().json();

  if (body.field.includes('no data')) {
    return HttpResponse.json({
      avg: 50,
      count: 1000,
      type: 'decimal',
    });
  }

  if (body.field.includes('integer')) {
    return HttpResponse.json({
      max: 100,
      min: 1,
      type: 'integer',
    });
  }

  if (body.field.includes('age')) {
    const result = generateSortedAdvancedData('age', 'integer');
    console.warn(`OcurrenceApi:Age (${result.type}) ${result.min}-${result.max}`);
    return HttpResponse.json(result);
  }

  if (body.field.includes('visits')) {
    const result = generateSortedAdvancedData('visits', 'integer');
    console.warn(`OcurrenceApi:Visits (${result.type}) ${result.min}-${result.max}`);
    return HttpResponse.json(result);
  }

  if (body.field.includes('progress')) {
    const result = generateSortedAdvancedData('progress', 'decimal');
    console.warn(`OcurrenceApi:Progress (${result.type}) ${result.min}-${result.max}`);
    return HttpResponse.json(result);
  }

  return HttpResponse.json({
    max: 100,
    min: 1,
    type: 'decimal',
  });
}

/*
 * Germline exclusive field
 * - [Germline tag]
 * - Inheritance
 * - Parental Origin
 * - Subsection: Family
 * - Father's Genotype
 * - Mother's Genotype
 * - Genotype Quality
 */
export async function httpGermlineOccurrenceExpandResponse() {
  return HttpResponse.json({
    locus_id: '-8318226658347712512',
    hgvsg: 'chr3:g.150703825A>T',
    locus: '3-150703825-A-T',
    chromosome: '3',
    start: 150703825,
    end: 150703825,
    symbol: 'ERICH6',
    transcript_id: 'ENST00000295910',
    is_canonical: true,
    is_mane_select: false,
    is_mane_plus: false,
    exon_rank: 1,
    exon_total: 14,
    dna_change: 'c.74T>A',
    vep_impact: 'HIGH',
    picked_consequences: ['stop_gained'],
    aa_change: 'p.Leu25Ter',
    gnomad_pli: 1.823e-29,
    gnomad_loeuf: 1.562,
    spliceai_type: ['DG'],
    spliceai_ds: 0.37,
    germline_pf_wgs: 0.5,
    germline_pc_wgs_affected: 6,
    germline_pn_wgs_affected: 10,
    germline_pf_wgs_affected: 0.6,
    germline_pc_wgs_not_affected: 1,
    germline_pn_wgs_not_affected: 4,
    germline_pf_wgs_not_affected: 0.25,
    gnomad_v3_af: 0.00189208,
    cadd_phred: 24.9,
    cadd_score: 0.65254,
    dann_score: 0.8992115,
    revel_score: 0.4,
    sift_pred: 0.4,
    sift_score: 0.5,
    fathmm_pred: 0.2,
    fathmm_score: 0.3,
    polyphen2_hvar_pred: 0.1,
    polyphen2_hvar_score: 0.88,
    phyloP17way_primate: 0.1,
    lrt_pred: 'N',
    lrt_score: 0.103055,
    zygosity: 'HET',
    parental_origin: 'DENOVO',
    father_calls: [1, 1],
    mother_calls: [0, 1],
    qd: 1.21,
    ad_alt: 6,
    ad_total: 34,
    genotype_quality: 47,
    filter: 'PASS',
    rsnumber: 'rs760342210',
    exomiser_acmg_evidence: ['PM2_Supporting'],
    exomiser_gene_combined_score: 0.5,
    exomiser_acmg_classification: 'uncertain_significance',
    transmission: 'autosomal_dominant',
    exomiser_acmg_classification_counts: {
      uncertain_significance: 1,
    },
    interpretation_classification_counts: {
      likelyPathogenic: 1,
    },
    ensembl_gene_id: 'ENSG00000163645',
    omim_conditions: [
      {
        omim_phenotype_id: '106300',
        panel: 'Spondyloarthropathy, susceptibility to, 1',
        inheritance_code: ['Mu'],
      },
      {
        omim_phenotype_id: '608579',
        panel: 'Stevens-Johnson syndrome, susceptibility to',
      },
      {
        omim_phenotype_id: '608579',
        panel: 'Toxic epidermal necrolysis, susceptibility to',
      },
    ],
  });
}

/**
 * Somatic exclusive field
 * - clinvar
 * - cosmic
 * - hotspot
 */
export async function httpSomaticOccurrenceExpandResponse() {
  return HttpResponse.json({
    locus_id: '-8627285076889042855',
    hgvsg: 'chr2:g.73113322_73113409del',
    locus: '2-73113321-CAGCCTCTTGGCGCGGACTTGGGGTGATGGGGACCCCCGCCGCTCCCCTGACCCCGGGCCGCGCTCTCCCCTCCTCCAGTCCGCCCCTG-C',
    chromosome: '2',
    aa_change: 'p.Leu25Ter',
    start: 73113321,
    end: 73113409,
    symbol: 'ERICH6',
    transcript_id: 'ENST00000608612',
    is_canonical: true,
    is_mane_select: false,
    is_mane_plus: false,
    rsnumber: 'rs760342210',
    clinvar: ['pathogenic', 'benign'],
    exon_rank: 2,
    exon_total: 2,
    dna_change: 'c.74T>A',
    vep_impact: 'HIGH',
    picked_consequences: ['splice_acceptor_variant', 'non_coding_transcript_exon_variant', 'intron_variant'],
    somatic_pc_tn_wgs: 1,
    somatic_pn_tn_wgs: 7,
    somatic_pf_tn_wgs: 10,
    ad_alt: 2,
    ad_total: 53,
    ad_ratio: 0.03773585,
    filter: 'weak_evidence',
    gnomad_pli: 1.823e-29,
    gnomad_loeuf: 1.562,
    spliceai_type: ['DG'],
    spliceai_ds: 0.37,
    ensembl_gene_id: 'ENSG00000163645',
    cadd_phred: 24.9,
    cadd_score: 0.65254,
    dann_score: 0.8992115,
    revel_score: 0.4,
    sift_pred: 0.4,
    sift_score: 0.5,
    fathmm_pred: 0.2,
    fathmm_score: 0.3,
    polyphen2_hvar_pred: 0.1,
    polyphen2_hvar_score: 0.88,
    phyloP17way_primate: 0.1,
    lrt_pred: 'N',
    lrt_score: 0.103055,
    omim_conditions: [
      {
        omim_phenotype_id: '106300',
        panel: 'Spondyloarthropathy, susceptibility to, 1',
        inheritance_code: ['Mu'],
      },
      {
        omim_phenotype_id: '608579',
        panel: 'Stevens-Johnson syndrome, susceptibility to',
      },
      {
        omim_phenotype_id: '608579',
        panel: 'Toxic epidermal necrolysis, susceptibility to',
      },
    ],
  });
}
