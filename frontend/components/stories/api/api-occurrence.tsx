import { HttpResponse } from 'msw';

export const occurrenceApi = 'api/occurrences/germline/snv/:case_id/:seq_id/aggregate';
export const statisticApi = 'api/occurrences/germline/snv/:case_id/:seq_id/statistics';

export type OccurenceHandler = {
  case_id: string;
  seq_id: string;
};

export async function httpOccurrenceApiResponse({ request }: any) {
  const body = await request.clone().json();
  const url = new URL(request.url);
  const dictionary = url.searchParams.get('with_dictionary');

  if (body.field.includes('toggle filter')) {
    return HttpResponse.json([
      {
        key: 'true',
        count: 150,
      },
      {
        key: 'false',
        count: 85,
      },
    ]);
  }

  const multiSelectResponse = [
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
      count: 200,
    });
  }

  return HttpResponse.json(multiSelectResponse);
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
