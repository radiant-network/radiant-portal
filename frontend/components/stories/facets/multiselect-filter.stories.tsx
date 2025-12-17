import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';

import { FilterConfigContext } from '@/components/base/query-filters/filter-list';
import { MultiSelectFilter } from '@/components/base/query-filters/multiselect-filter';
import { AggregateContext } from '@/components/base/query-filters/use-aggregation-builder';
import { Card } from '@/components/base/shadcn/card';
import {
  type Aggregation,
  ApplicationId,
  ConfigProvider,
  type PortalConfig,
} from '@/components/cores/applications-config';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: {
      variant: {
        items: [],
      },
    },
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: {
      variant: {
        items: [],
      },
    },
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const occurrenceApi = '/api/occurrences/germline/snv/1/1/aggregate';

async function httpOccurrenceApiResponse({ request }: any) {
  const url = new URL(request.url);
  const isDictionaryToggleOn = url.searchParams.get('with_dictionary') === 'true';

  if (isDictionaryToggleOn) {
    return HttpResponse.json([
      {
        key: 'option_1',
        count: 150,
      },
      {
        key: 'option_2',
        count: 95,
      },
      {
        key: 'option_3',
        count: 75,
      },
      {
        key: 'option_4',
        count: 50,
      },
      {
        key: 'option_5',
        count: 30,
      },
      {
        key: 'option_6',
        count: 0,
      },
      {
        key: 'option_7',
        count: 0,
      },
      {
        key: 'option_8',
        count: 0,
      },
    ]);
  }
  return HttpResponse.json([
    {
      key: 'option_1',
      count: 150,
    },
    {
      key: 'option_2',
      count: 95,
    },
    {
      key: 'option_3',
      count: 75,
    },
    {
      key: 'option_4',
      count: 50,
    },
    {
      key: 'option_5',
      count: 30,
    },
  ]);
}

async function httpEmptyApiResponse() {
  return HttpResponse.json([]);
}

const filterField: Aggregation = {
  key: 'sample_filter',
  translation_key: 'sample_filter',
  type: 'multiple',
};

const filterFieldWithDictionary: Aggregation = {
  key: 'filter_with_dictionary',
  translation_key: 'filter_with_dictionary',
  type: 'multiple',
  withDictionary: true,
};

const filterFieldEmpty: Aggregation = {
  key: 'empty_filter',
  translation_key: 'empty_filter',
  type: 'multiple',
};

const meta = {
  title: 'Facets/MultiSelectFilter',
  component: MultiSelectFilter,
  args: {
    field: filterField,
    maxVisibleItems: 5,
  },
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/case/1']}>
        <Routes>
          <Route
            path="/case/:caseId"
            element={
              <ConfigProvider config={config}>
                <FilterConfigContext.Provider
                  value={{ appId: config.snv_occurrence.app_id, aggregations: config.snv_occurrence.aggregations }}
                >
                  <AggregateContext.Provider value={{ caseId: 1, seqId: 1 }}>
                    <div className="w-[320px] p-4 bg-muted">
                      <Card>
                        <Story />
                      </Card>
                    </div>
                  </AggregateContext.Provider>
                </FilterConfigContext.Provider>
              </ConfigProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof MultiSelectFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [http.post(occurrenceApi, httpOccurrenceApiResponse)],
    },
  },
};

export const WithDictionary: Story = {
  args: {
    field: filterFieldWithDictionary,
  },
  parameters: {
    msw: {
      handlers: [http.post(occurrenceApi, httpOccurrenceApiResponse)],
    },
  },
};

export const Empty: Story = {
  args: {
    field: filterFieldEmpty,
  },
  parameters: {
    msw: {
      handlers: [http.post(occurrenceApi, httpEmptyApiResponse)],
    },
  },
};
