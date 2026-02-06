import { HttpResponse } from 'msw';

export const userPreferenceApi = 'api/users/preferences/:key';

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
              value: ['Henry', 'Jack', 'Irene', 'Liam', 'Olivia', 'Tanner'],
            },
            op: 'in',
          },
          {
            content: {
              field: 'lastName',
              value: ['Tremblay', 'Anderson', 'Young'],
            },
            op: 'in',
          },
          {
            content: {
              field: 'status',
              value: ['Single'],
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
