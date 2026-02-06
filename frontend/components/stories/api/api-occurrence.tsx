import { HttpResponse } from 'msw';

import {
  advancedData,
  generateBooleanData,
  generateMultiSelectData,
  generateSortedAdvancedData,
} from '../table/table-mock';

export const occurrenceListApi = 'api/occurrences/germline/:type/:case_id/:seq_id/list';
export const occurrenceAggregateApi = 'api/occurrences/germline/:type/:case_id/:seq_id/aggregate';
export const occurrenceAggregateStatisticApi = 'api/occurrences/germline/:type/:case_id/:seq_id/statistics';

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
    return HttpResponse.json(generateSortedAdvancedData('age', 'integer'));
  }

  if (body.field.includes('visits')) {
    return HttpResponse.json(generateSortedAdvancedData('visits', 'integer'));
  }

  if (body.field.includes('progress')) {
    return HttpResponse.json(generateSortedAdvancedData('progress', 'decimal'));
  }

  return HttpResponse.json({
    max: 100,
    min: 1,
    type: 'decimal',
  });
}
