import { HttpResponse } from 'msw';

import { SqonContent, SqonOpEnum } from '@/api/api';

import { advancedData, AdvancedTableMockData } from '../table/table-mock';

export const mockAggregateApi = 'api/mock/aggregate';
export const mockAggregateStatisticApi = 'api/mock/statistics';
export const mockListApi = 'api/mock/list';
export const mockCountApi = 'api/mock/count';

function filterMockData(sqon: { content: SqonContent; op: SqonOpEnum }) {
  return advancedData.filter((data: AdvancedTableMockData) => {
    let matched = false;
    // @ts-ignore
    sqon.content.forEach(content => {
      // IValueFacet
      const field = content.content.field;
      const values = content.content.value;
      if (values.includes(data[field as keyof AdvancedTableMockData])) {
        matched = true;
      }
    });
    return matched;
  });
}

export async function httpMockListApiResponse({ request }: any) {
  const body = await request.clone().json();

  const sqon = body.listBody?.sqon;
  if (sqon && sqon.content.length > 0) {
    return HttpResponse.json(filterMockData(sqon));
  }

  return HttpResponse.json(advancedData);
}

export async function httpMockCountApiResponse({ request }: any) {
  const body = await request.clone().json();
  const sqon = body.countBody?.sqon;
  if (sqon && sqon.content.length > 0) {
    const result = filterMockData(sqon);
    return HttpResponse.json({ count: result.length });
  }
  return HttpResponse.json({ count: advancedData.length });
}
