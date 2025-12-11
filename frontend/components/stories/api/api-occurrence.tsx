import { HttpResponse } from 'msw';

export const occurrenceApi = '/api/occurrences/germline/snv/1/1/aggregate';
export const statisticApi = '/api/occurrences/germline/snv/1/1/statistics';

export function httpOccurrenceApiResponse() {
  return HttpResponse.json([
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
      key: 'porttitor_nec_ligula.',
      count: 40,
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
      key: 'IG_J_pseudogene',
      count: 168,
    },
    {
      key: 'lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit',
      count: 191,
    },
    {
      key: 'nam_diam_urna',
      count: 227,
    },
  ]);
}

export async function httpStatisticsApiResponse({ request }: any) {
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

  return HttpResponse.json({
    max: 100,
    min: 1,
    type: 'decimal',
  });
}
