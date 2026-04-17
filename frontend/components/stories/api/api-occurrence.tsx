import { HttpResponse } from 'msw';

import { generateBooleanData, generateMultiSelectData, generateSortedAdvancedData } from '../table/table-mock';

export const occurrenceListApi = `api/occurrences/germline/:type/:case_id/:seq_id/list`;
export const occurrenceAggregateApi = `api/occurrences/germline/:type/:case_id/:seq_id/aggregate`;
export const occurrenceAggregateStatisticApi = `api/occurrences/germline/:type/:case_id/:seq_id/statistics`;
export const occurrenceExpandApi = `api/occurrences/germline/:type/:case_id/:seq_id/:locus_id/expanded`;

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

export async function httpOccurrenceExpandResponse() {
  return HttpResponse.json({
    locus_id: '-1111111111111111111',
    hgvsg: 'chr1:g.9244928_9244935del',
    locus: '1-9244919-CCCCAGGCA-C',
    chromosome: '1',
    start: 9244919,
    end: 9244927,
    symbol: 'H6PD',
    transcript_id: 'ENST00000377403',
    is_canonical: true,
    is_mane_select: false,
    is_mane_plus: false,
    exon_rank: 2,
    exon_total: 5,
    vep_impact: 'HIGH',
    picked_consequences: ['splice_acceptor_variant', '5_prime_UTR_variant', 'intron_variant'],
    clinvar: ['Benign'],
    gnomad_pli: 8.5874e-9,
    gnomad_loeuf: 0.941,
    germline_pf_wgs: 0.14285714285714285,
    germline_pc_wgs_affected: 1,
    germline_pn_wgs_affected: 10,
    germline_pf_wgs_affected: 0.1,
    germline_pc_wgs_not_affected: 1,
    germline_pn_wgs_not_affected: 4,
    germline_pf_wgs_not_affected: 0.25,
    gnomad_v3_af: 0.123104,
    zygosity: 'HET',
    omim_conditions: [
      {
        omim_phenotype_id: '604931',
        panel: 'Cortisone reductase deficiency 1',
        inheritance_code: ['AR'],
      },
    ],
    qd: 14.57,
    ad_alt: 20,
    ad_total: 48,
    genotype_quality: 99,
    filter: 'PASS',
    exomiser_acmg_evidence: null,
    exomiser_gene_combined_score: 0,
    ensembl_gene_id: 'ENSG00000049239',
  });
}
