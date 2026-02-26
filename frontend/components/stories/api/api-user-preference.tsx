import { HttpResponse } from 'msw';

import { BASE_URL } from './constant';

export const userPreferenceApi = `${BASE_URL}api/users/preferences/:key`;

export async function httpUserPreferenceApiResponse({ params }: any) {
  const key = params.key;

  if (key === 'data-table-storybook-query-builder') {
    return new HttpResponse(null, { status: 404 });
  }

  if (key === 'query-builder-cnv_occurrence') {
    return new HttpResponse(null, { status: 404 });
  }

  return HttpResponse.json({
    activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
    sqons: [
      {
        id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
        content: [
          {
            content: {
              field: 'firstName',
              value: ['henry', 'jack', 'irene', 'liam', 'olivia', 'tanner'],
            },
            op: 'in',
          },
          {
            content: {
              field: 'lastName',
              value: ['tremblay', 'anderson', 'young'],
            },
            op: 'in',
          },
          {
            content: {
              field: 'status',
              value: ['single'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
    ],
    savedFilters: [],
    selectedQueryIndexes: [0],
  });
}
