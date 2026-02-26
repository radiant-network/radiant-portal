import { HttpResponse } from 'msw';

import { SqonContent, SqonOpEnum } from '@/api/api';

import { advancedData, AdvancedTableMockData } from '../table/table-mock';

import { BASE_URL } from './constant';

export const mockAggregateApi = `${BASE_URL}api/mock/aggregate`;
export const mockAggregateStatisticApi = `${BASE_URL}api/mock/statistics`;
export const mockListApi = `${BASE_URL}api/mock/list`;
export const mockCountApi = `${BASE_URL}api/mock/count`;

/**
 * Read a sqon to query AdvancedTableMockData and simulate a response
 */
function querySqon(data: AdvancedTableMockData, sqon: any): boolean {
  const { op } = sqon;

  const field = sqon.content.field;
  const values = sqon.content.value;
  const target = data[field as keyof AdvancedTableMockData]?.toString().toLowerCase();

  switch (op) {
    case SqonOpEnum.In: {
      return values.includes(target);
    }
    case SqonOpEnum.And: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.Or: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.Not: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.Between: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.GreaterThan: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.LessThan: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.GreaterThanOrEqualTo: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.LessThanOrEqualTo: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }

    case SqonOpEnum.NotIn: {
      return !values.includes(target);
    }

    case SqonOpEnum.All: {
      console.warn(`mock-api:filtercontent ${op} operator has not been coded`);
      return true;
    }
  }
  return false;
}

function filterMockData(sqon: { content: SqonContent; op: SqonOpEnum }) {
  return advancedData.filter((data: AdvancedTableMockData) => {
    switch (sqon.op) {
      // OR
      case SqonOpEnum.Or: {
        // @ts-ignore
        const result = sqon.content.map((content: any) => querySqon(data, content));
        return result.includes(true);
      }
      // AND
      default: {
        // @ts-ignore
        const result = sqon.content.map((content: any) => querySqon(data, content));
        return result.every((r: boolean) => r === true);
      }
    }
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
