import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { X } from 'lucide-react';
import { delay, http, HttpResponse } from 'msw';

import { SidebarProvider } from '@/components/base/ui/sidebar';
import { FilterList } from '@/components/feature/query-filters/filter-list';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';

import {
  httpOccurenceApiResponse,
  httpStatisticsApiResponse,
  occurenceApi,
  statisticApi,
} from '../public/api-occurence';

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity',
  },
  variant_exploration: {
    app_id: 'variant_exploration_multi_select_filter',
    aggregations: {
      example: {
        items: [
          {
            key: 'multiple',
            type: 'multiple',
          },
          {
            key: 'numerical (decimal)',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: 'LessThan',
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'numerical (integer)',
            type: 'numerical',
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: 'LessThan',
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'boolean',
            type: 'boolean',
          },
        ],
      },
    },
  },
  admin: {
    admin_code: 'admin',
    app_id: 'admin',
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'Facets/FilterList',
  component: FilterList,
  args: {
    groupKey: 'example',
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <SidebarProvider className="h-full flex flex-row">
            <div className="bg-muted overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out w-[280px] p-4 opacity-100 relative">
              <div className="whitespace-nowrap">
                <div className="flex justify-end mb-4">
                  <button className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
                <Story />
              </div>
            </div>
          </SidebarProvider>
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof FilterList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [http.post(occurenceApi, httpOccurenceApiResponse), http.post(statisticApi, httpStatisticsApiResponse)],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(occurenceApi, async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
