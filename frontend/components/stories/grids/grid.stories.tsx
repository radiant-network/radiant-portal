import type { Meta, StoryObj } from '@storybook/react';

import Grid from '@/components/base/grids/grid';

import { StorySection } from '../story-section';
import { hpoProps, mondoProps } from '../charts/horizontal-bar-chart.stories';
import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import { sexProps, ethnicityProps, raceProps, studiesProps } from '../charts/pie-chart.stories';
import PieChart from '@/components/base/charts/pie-charts/pie-chart';
import VerticalBarChart from '@/components/base/charts/bar-charts/vertical-bar-chart';
import { ageAtFirstEngagementFKProps, ageAtFirstEngagementIncludeProps } from '../charts/vertical-bar-chart.stories';
import GroupedVerticalBarChart from '@/components/base/charts/bar-charts/grouped-vertical-bar-chart';
import { userPreferenceApi } from '../api/api-user-preference';
import { delay, http, HttpResponse } from 'msw';

const meta = {
  title: 'Components/Grids/Grid',
  component: Grid,
  args: {
    id: 'storybook-default',
    cards: [
      {
        id: '1',
        title: 'Most Frequent Phenotype (HPO)',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '2',
        title: 'Most Frequent Diagnoses (MONDO)',
        content: <HorizontalBarChart {...mondoProps} />,
      },
      {
        id: '3',
        title: 'Demographics',
        content: (
          <div className="flex gap-2 h-full p-2">
            {[sexProps, ethnicityProps, raceProps].map((props, i) => (
              <div key={i} className="flex-1 min-w-0 h-full">
                <PieChart {...props} />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: '4',
        title: 'Studies',
        content: <PieChart {...studiesProps} />,
      },
      {
        id: '5',
        title: 'Age at First Patient Engagement (years)',
        content: <VerticalBarChart {...ageAtFirstEngagementFKProps} />,
      },
      {
        id: '6',
        title: 'Age at First Patient Engagement (years) (Include)',
        content: <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} />,
      },
    ],
    defaultLayouts: {
      lg: [
        { i: '1', x: 0, y: 0, w: 6, h: 3 },
        { i: '2', x: 6, y: 0, w: 6, h: 3 },
        { i: '3', x: 0, y: 3, w: 4, h: 2 },
        { i: '4', x: 4, y: 3, w: 2, h: 2 },
        { i: '5', x: 6, y: 3, w: 6, h: 2 },
        { i: '6', x: 0, y: 5, w: 6, h: 3 },
      ],
      md: [
        { i: '1', x: 0, y: 0, w: 5, h: 3 },
        { i: '2', x: 5, y: 0, w: 5, h: 3 },
        { i: '3', x: 0, y: 3, w: 3, h: 2 },
        { i: '4', x: 3, y: 3, w: 2, h: 2 },
        { i: '5', x: 5, y: 3, w: 5, h: 2 },
        { i: '6', x: 0, y: 5, w: 5, h: 3 },
      ],
      sm: [
        { i: '1', x: 0, y: 0, w: 3, h: 3 },
        { i: '2', x: 3, y: 0, w: 3, h: 3 },
        { i: '3', x: 0, y: 3, w: 4, h: 2 },
        { i: '4', x: 4, y: 3, w: 2, h: 2 },
        { i: '5', x: 0, y: 5, w: 3, h: 2 },
        { i: '6', x: 3, y: 5, w: 3, h: 2 },
      ],
      xs: [
        { i: '1', x: 0, y: 0, w: 4, h: 3 },
        { i: '2', x: 0, y: 3, w: 4, h: 3 },
        { i: '3', x: 0, y: 6, w: 4, h: 2 },
        { i: '4', x: 0, y: 8, w: 4, h: 2 },
        { i: '5', x: 0, y: 10, w: 4, h: 2 },
        { i: '6', x: 0, y: 12, w: 4, h: 3 },
      ],
      xxs: [
        { i: '1', x: 0, y: 0, w: 2, h: 3 },
        { i: '2', x: 0, y: 3, w: 2, h: 3 },
        { i: '3', x: 0, y: 6, w: 2, h: 2 },
        { i: '4', x: 0, y: 8, w: 2, h: 2 },
        { i: '5', x: 0, y: 10, w: 2, h: 2 },
        { i: '6', x: 0, y: 12, w: 2, h: 3 },
      ],
    },
    optionsMenuSettings: {
      visible: true,
      tooltipText: 'Charts',
    },
    gridCardProps: {
      closeText: 'Remove Chart',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(userPreferenceApi, async () => {
          await delay(10000);
          return HttpResponse.json({
            content: {
              layouts: {
                lg: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 8, h: 2 },
                  { i: '3', x: 4, y: 2, w: 8, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 9, h: 3 },
                  { i: '6', x: 0, y: 7, w: 12, h: 4 },
                ],
                md: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 6, h: 2 },
                  { i: '3', x: 4, y: 2, w: 6, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 7, h: 3 },
                  { i: '6', x: 0, y: 7, w: 10, h: 4 },
                ],
                sm: [
                  { i: '1', x: 0, y: 0, w: 6, h: 3 },
                  { i: '2', x: 0, y: 3, w: 3, h: 2 },
                  { i: '3', x: 3, y: 3, w: 3, h: 2 },
                  { i: '4', x: 0, y: 5, w: 2, h: 2 },
                  { i: '5', x: 2, y: 5, w: 4, h: 3 },
                  { i: '6', x: 0, y: 8, w: 6, h: 4 },
                ],
                xs: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 0, y: 4, w: 4, h: 2 },
                  { i: '3', x: 0, y: 6, w: 4, h: 2 },
                  { i: '4', x: 0, y: 8, w: 4, h: 2 },
                  { i: '5', x: 0, y: 10, w: 4, h: 3 },
                  { i: '6', x: 0, y: 13, w: 4, h: 4 },
                ],
                xxs: [
                  { i: '1', x: 0, y: 0, w: 2, h: 4 },
                  { i: '2', x: 0, y: 4, w: 2, h: 2 },
                  { i: '3', x: 0, y: 6, w: 2, h: 2 },
                  { i: '4', x: 0, y: 8, w: 2, h: 2 },
                  { i: '5', x: 0, y: 10, w: 2, h: 3 },
                  { i: '6', x: 0, y: 13, w: 2, h: 4 },
                ],
              },
            },
          });
        }),
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-loading',
  },
  render: args => (
    <StorySection title="Grid - Loading state: skeleton is shown while user preferences are being fetched (10s delay). Refresh to replay.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  render: args => (
    <StorySection title="Grid - Fresh state: no saved user preferences, so the grid renders from the defaultLayouts prop with every card active.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const Edited: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(userPreferenceApi, async () => {
          await delay(250);
          return HttpResponse.json({
            content: {
              layouts: {
                lg: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 8, h: 2 },
                  { i: '3', x: 4, y: 2, w: 8, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 9, h: 3 },
                  { i: '6', x: 0, y: 7, w: 12, h: 4 },
                ],
                md: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 6, h: 2 },
                  { i: '3', x: 4, y: 2, w: 6, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 7, h: 3 },
                  { i: '6', x: 0, y: 7, w: 10, h: 4 },
                ],
                sm: [
                  { i: '1', x: 0, y: 0, w: 6, h: 3 },
                  { i: '2', x: 0, y: 3, w: 3, h: 2 },
                  { i: '3', x: 3, y: 3, w: 3, h: 2 },
                  { i: '4', x: 0, y: 5, w: 2, h: 2 },
                  { i: '5', x: 2, y: 5, w: 4, h: 3 },
                  { i: '6', x: 0, y: 8, w: 6, h: 4 },
                ],
                xs: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 0, y: 4, w: 4, h: 2 },
                  { i: '3', x: 0, y: 6, w: 4, h: 2 },
                  { i: '4', x: 0, y: 8, w: 4, h: 2 },
                  { i: '5', x: 0, y: 10, w: 4, h: 3 },
                  { i: '6', x: 0, y: 13, w: 4, h: 4 },
                ],
                xxs: [
                  { i: '1', x: 0, y: 0, w: 2, h: 4 },
                  { i: '2', x: 0, y: 4, w: 2, h: 2 },
                  { i: '3', x: 0, y: 6, w: 2, h: 2 },
                  { i: '4', x: 0, y: 8, w: 2, h: 2 },
                  { i: '5', x: 0, y: 10, w: 2, h: 3 },
                  { i: '6', x: 0, y: 13, w: 2, h: 4 },
                ],
              },
              defaultLayouts: {
                lg: [
                  { i: '1', x: 0, y: 0, w: 6, h: 3 },
                  { i: '2', x: 6, y: 0, w: 6, h: 3 },
                  { i: '3', x: 0, y: 3, w: 4, h: 2 },
                  { i: '4', x: 4, y: 3, w: 2, h: 2 },
                  { i: '5', x: 6, y: 3, w: 6, h: 2 },
                  { i: '6', x: 0, y: 5, w: 6, h: 3 },
                ],
                md: [
                  { i: '1', x: 0, y: 0, w: 5, h: 3 },
                  { i: '2', x: 5, y: 0, w: 5, h: 3 },
                  { i: '3', x: 0, y: 3, w: 3, h: 2 },
                  { i: '4', x: 3, y: 3, w: 2, h: 2 },
                  { i: '5', x: 5, y: 3, w: 5, h: 2 },
                  { i: '6', x: 0, y: 5, w: 5, h: 3 },
                ],
                sm: [
                  { i: '1', x: 0, y: 0, w: 3, h: 3 },
                  { i: '2', x: 3, y: 0, w: 3, h: 3 },
                  { i: '3', x: 0, y: 3, w: 4, h: 2 },
                  { i: '4', x: 4, y: 3, w: 2, h: 2 },
                  { i: '5', x: 0, y: 5, w: 3, h: 2 },
                  { i: '6', x: 3, y: 5, w: 3, h: 2 },
                ],
                xs: [
                  { i: '1', x: 0, y: 0, w: 4, h: 3 },
                  { i: '2', x: 0, y: 3, w: 4, h: 3 },
                  { i: '3', x: 0, y: 6, w: 4, h: 2 },
                  { i: '4', x: 0, y: 8, w: 4, h: 2 },
                  { i: '5', x: 0, y: 10, w: 4, h: 2 },
                  { i: '6', x: 0, y: 12, w: 4, h: 3 },
                ],
                xxs: [
                  { i: '1', x: 0, y: 0, w: 2, h: 3 },
                  { i: '2', x: 0, y: 3, w: 2, h: 3 },
                  { i: '3', x: 0, y: 6, w: 2, h: 2 },
                  { i: '4', x: 0, y: 8, w: 2, h: 2 },
                  { i: '5', x: 0, y: 10, w: 2, h: 2 },
                  { i: '6', x: 0, y: 12, w: 2, h: 3 },
                ],
              },
              activeCards: ['1', '2', '4', '5', '6'],
            },
          });
        }),
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-edited',
  },
  render: args => (
    <StorySection title="Grid - Restored state: saved defaultLayouts match the current config, so the user's custom layouts and activeCards are loaded from preferences (Demographics is inactive).">
      <Grid {...args} />
    </StorySection>
  ),
};

export const OutdatedLayouts: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(userPreferenceApi, async () => {
          await delay(250);
          return HttpResponse.json({
            content: {
              layouts: {
                lg: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 8, h: 2 },
                  { i: '3', x: 4, y: 2, w: 8, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 9, h: 3 },
                ],
                md: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 4, y: 0, w: 6, h: 2 },
                  { i: '3', x: 4, y: 2, w: 6, h: 2 },
                  { i: '4', x: 0, y: 4, w: 3, h: 2 },
                  { i: '5', x: 3, y: 4, w: 7, h: 3 },
                ],
                sm: [
                  { i: '1', x: 0, y: 0, w: 6, h: 3 },
                  { i: '2', x: 0, y: 3, w: 3, h: 2 },
                  { i: '3', x: 3, y: 3, w: 3, h: 2 },
                  { i: '4', x: 0, y: 5, w: 2, h: 2 },
                  { i: '5', x: 2, y: 5, w: 4, h: 3 },
                ],
                xs: [
                  { i: '1', x: 0, y: 0, w: 4, h: 4 },
                  { i: '2', x: 0, y: 4, w: 4, h: 2 },
                  { i: '3', x: 0, y: 6, w: 4, h: 2 },
                  { i: '4', x: 0, y: 8, w: 4, h: 2 },
                  { i: '5', x: 0, y: 10, w: 4, h: 3 },
                ],
                xxs: [
                  { i: '1', x: 0, y: 0, w: 2, h: 4 },
                  { i: '2', x: 0, y: 4, w: 2, h: 2 },
                  { i: '3', x: 0, y: 6, w: 2, h: 2 },
                  { i: '4', x: 0, y: 8, w: 2, h: 2 },
                  { i: '5', x: 0, y: 10, w: 2, h: 3 },
                ],
              },
              defaultLayouts: {
                lg: [
                  { i: '1', x: 0, y: 0, w: 6, h: 3 },
                  { i: '2', x: 6, y: 0, w: 6, h: 3 },
                  { i: '3', x: 0, y: 3, w: 4, h: 2 },
                  { i: '4', x: 4, y: 3, w: 2, h: 2 },
                  { i: '5', x: 6, y: 3, w: 6, h: 2 },
                ],
                md: [
                  { i: '1', x: 0, y: 0, w: 5, h: 3 },
                  { i: '2', x: 5, y: 0, w: 5, h: 3 },
                  { i: '3', x: 0, y: 3, w: 3, h: 2 },
                  { i: '4', x: 3, y: 3, w: 2, h: 2 },
                  { i: '5', x: 5, y: 3, w: 5, h: 2 },
                ],
                sm: [
                  { i: '1', x: 0, y: 0, w: 3, h: 3 },
                  { i: '2', x: 3, y: 0, w: 3, h: 3 },
                  { i: '3', x: 0, y: 3, w: 4, h: 2 },
                  { i: '4', x: 4, y: 3, w: 2, h: 2 },
                  { i: '5', x: 0, y: 5, w: 3, h: 2 },
                ],
                xs: [
                  { i: '1', x: 0, y: 0, w: 4, h: 3 },
                  { i: '2', x: 0, y: 3, w: 4, h: 3 },
                  { i: '3', x: 0, y: 6, w: 4, h: 2 },
                  { i: '4', x: 0, y: 8, w: 4, h: 2 },
                  { i: '5', x: 0, y: 10, w: 4, h: 2 },
                ],
                xxs: [
                  { i: '1', x: 0, y: 0, w: 2, h: 3 },
                  { i: '2', x: 0, y: 3, w: 2, h: 3 },
                  { i: '3', x: 0, y: 6, w: 2, h: 2 },
                  { i: '4', x: 0, y: 8, w: 2, h: 2 },
                  { i: '5', x: 0, y: 10, w: 2, h: 2 },
                ],
              },
              activeCards: ['1', '2', '4', '5'],
            },
          });
        }),
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-default-layouts-updated',
  },
  render: args => (
    <StorySection title="Grid - Conflict recovery: saved defaultLayouts are stale (missing card '6'), so the local defaultLayouts win and the saved layouts/activeCards are discarded to prevent inconsistencies.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const WithoutOptionsMenuSettings: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-hidden',
    cards: [
      {
        id: '1',
        title: 'Most Frequent Phenotype (HPO)',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '2',
        title: 'Most Frequent Diagnoses (MONDO)',
        content: <HorizontalBarChart {...mondoProps} />,
      },
      {
        id: '3',
        title: 'Demographics',
        content: (
          <div className="flex gap-2 h-full p-2">
            {[sexProps, ethnicityProps, raceProps].map((props, i) => (
              <div key={i} className="flex-1 min-w-0 h-full">
                <PieChart {...props} />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: '4',
        title: 'Studies',
        content: <PieChart {...studiesProps} />,
      },
      {
        id: '5',
        title: 'Age at First Patient Engagement (years)',
        content: <VerticalBarChart {...ageAtFirstEngagementFKProps} />,
      },
      {
        id: '6',
        title: 'Age at First Patient Engagement (years) (Include)',
        content: <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} />,
      },
    ],
    optionsMenuSettings: {
      visible: false,
    },
  },

  render: args => (
    <StorySection title="Grid - optionsMenuSettings.visible is false: the top-right settings menu (toggle cards, reset layout) is hidden — cards can still be closed individually.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const StaticGrid: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-all-static',
    cards: [
      {
        id: '1',
        title: 'Most Frequent Phenotype (HPO)',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '2',
        title: 'Most Frequent Diagnoses (MONDO)',
        content: <HorizontalBarChart {...mondoProps} />,
      },
      {
        id: '3',
        title: 'Studies',
        content: <PieChart {...studiesProps} />,
      },
      {
        id: '4',
        title: 'Age at First Patient Engagement (years)',
        content: <VerticalBarChart {...ageAtFirstEngagementFKProps} />,
      },
    ],
    defaultLayouts: {
      lg: [
        { i: '1', x: 0, y: 0, w: 6, h: 3, static: true },
        { i: '2', x: 6, y: 0, w: 6, h: 3, static: true },
        { i: '3', x: 0, y: 3, w: 6, h: 3, static: true },
        { i: '4', x: 6, y: 3, w: 6, h: 3, static: true },
      ],
      md: [
        { i: '1', x: 0, y: 0, w: 5, h: 3, static: true },
        { i: '2', x: 5, y: 0, w: 5, h: 3, static: true },
        { i: '3', x: 0, y: 3, w: 5, h: 3, static: true },
        { i: '4', x: 5, y: 3, w: 5, h: 3, static: true },
      ],
      sm: [
        { i: '1', x: 0, y: 0, w: 3, h: 3, static: true },
        { i: '2', x: 3, y: 0, w: 3, h: 3, static: true },
        { i: '3', x: 0, y: 3, w: 3, h: 3, static: true },
        { i: '4', x: 3, y: 3, w: 3, h: 3, static: true },
      ],
      xs: [
        { i: '1', x: 0, y: 0, w: 4, h: 3, static: true },
        { i: '2', x: 0, y: 3, w: 4, h: 3, static: true },
        { i: '3', x: 0, y: 6, w: 4, h: 3, static: true },
        { i: '4', x: 0, y: 9, w: 4, h: 3, static: true },
      ],
      xxs: [
        { i: '1', x: 0, y: 0, w: 2, h: 3, static: true },
        { i: '2', x: 0, y: 3, w: 2, h: 3, static: true },
        { i: '3', x: 0, y: 6, w: 2, h: 3, static: true },
        { i: '4', x: 0, y: 9, w: 2, h: 3, static: true },
      ],
    },
  },
  render: args => (
    <StorySection title="Grid - Fully static grid: every card shares the same width/height, and no card can be dragged or resized.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const DraggableGrid: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-draggable-only',
    defaultLayouts: {
      lg: [
        { i: '1', x: 0, y: 0, w: 4, h: 3, isResizable: false },
        { i: '2', x: 4, y: 0, w: 4, h: 3, isResizable: false },
        { i: '3', x: 8, y: 0, w: 4, h: 3, isResizable: false },
        { i: '4', x: 0, y: 3, w: 4, h: 3, isResizable: false },
        { i: '5', x: 4, y: 3, w: 4, h: 3, isResizable: false },
        { i: '6', x: 8, y: 3, w: 4, h: 3, isResizable: false },
      ],
      md: [
        { i: '1', x: 0, y: 0, w: 3, h: 3, isResizable: false },
        { i: '2', x: 3, y: 0, w: 3, h: 3, isResizable: false },
        { i: '3', x: 6, y: 0, w: 3, h: 3, isResizable: false },
        { i: '4', x: 0, y: 3, w: 3, h: 3, isResizable: false },
        { i: '5', x: 3, y: 3, w: 3, h: 3, isResizable: false },
        { i: '6', x: 6, y: 3, w: 3, h: 3, isResizable: false },
      ],
      sm: [
        { i: '1', x: 0, y: 0, w: 2, h: 3, isResizable: false },
        { i: '2', x: 2, y: 0, w: 2, h: 3, isResizable: false },
        { i: '3', x: 4, y: 0, w: 2, h: 3, isResizable: false },
        { i: '4', x: 0, y: 3, w: 2, h: 3, isResizable: false },
        { i: '5', x: 2, y: 3, w: 2, h: 3, isResizable: false },
        { i: '6', x: 4, y: 3, w: 2, h: 3, isResizable: false },
      ],
      xs: [
        { i: '1', x: 0, y: 0, w: 4, h: 3, isResizable: false },
        { i: '2', x: 0, y: 3, w: 4, h: 3, isResizable: false },
        { i: '3', x: 0, y: 6, w: 4, h: 3, isResizable: false },
        { i: '4', x: 0, y: 9, w: 4, h: 3, isResizable: false },
        { i: '5', x: 0, y: 12, w: 4, h: 3, isResizable: false },
        { i: '6', x: 0, y: 15, w: 4, h: 3, isResizable: false },
      ],
      xxs: [
        { i: '1', x: 0, y: 0, w: 2, h: 3, isResizable: false },
        { i: '2', x: 0, y: 3, w: 2, h: 3, isResizable: false },
        { i: '3', x: 0, y: 6, w: 2, h: 3, isResizable: false },
        { i: '4', x: 0, y: 9, w: 2, h: 3, isResizable: false },
        { i: '5', x: 0, y: 12, w: 2, h: 3, isResizable: false },
        { i: '6', x: 0, y: 15, w: 2, h: 3, isResizable: false },
      ],
    },
  },
  render: args => (
    <StorySection title="Grid - Draggable only: cards keep their fixed width/height (isResizable: false), but can still be dragged to reorder the grid.">
      <Grid {...args} />
    </StorySection>
  ),
};

export const GridCard: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(userPreferenceApi, async () => {
          return new HttpResponse({ status: 200 });
        }),
      ],
    },
  },
  args: {
    id: 'storybook-resizable-card',
    gridCardProps: {
      closeText: 'Remove Card',
    },
    cards: [
      {
        id: '1',
        title: 'static: true',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '2',
        title: 'isDraggable: false',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '3',
        title: 'isResizable: false',
        content: <HorizontalBarChart {...hpoProps} />,
      },
      {
        id: '4',
        title: 'isBounded: false',
        content: <HorizontalBarChart {...hpoProps} />,
      },
    ],
    defaultLayouts: {
      lg: [
        { i: '1', x: 0, y: 0, w: 6, h: 3, static: true },
        { i: '2', x: 6, y: 0, w: 6, h: 3, isDraggable: false },
        { i: '3', x: 0, y: 3, w: 6, h: 3, isResizable: false },
        { i: '4', x: 6, y: 3, w: 6, h: 3, isBounded: false },
      ],
      md: [
        { i: '1', x: 0, y: 0, w: 5, h: 3, static: true },
        { i: '2', x: 5, y: 0, w: 5, h: 3, isDraggable: false },
        { i: '3', x: 0, y: 3, w: 5, h: 3, isResizable: false },
        { i: '4', x: 5, y: 3, w: 5, h: 3, isBounded: false },
      ],
      sm: [
        { i: '1', x: 0, y: 0, w: 3, h: 3, static: true },
        { i: '2', x: 3, y: 0, w: 3, h: 3, isDraggable: false },
        { i: '3', x: 0, y: 3, w: 4, h: 3, isResizable: false },
        { i: '4', x: 4, y: 3, w: 4, h: 3, isBounded: false },
      ],
      xs: [
        { i: '1', x: 0, y: 0, w: 4, h: 3, static: true },
        { i: '2', x: 0, y: 3, w: 4, h: 3, isDraggable: false },
        { i: '3', x: 0, y: 6, w: 4, h: 3, isResizable: false },
        { i: '4', x: 0, y: 9, w: 4, h: 3, isBounded: false },
      ],
      xxs: [
        { i: '1', x: 0, y: 0, w: 2, h: 3, static: true },
        { i: '2', x: 0, y: 3, w: 2, h: 3, isDraggable: false },
        { i: '3', x: 0, y: 6, w: 2, h: 3, isResizable: false },
        { i: '4', x: 0, y: 9, w: 2, h: 3, isBounded: false },
      ],
    },
  },
  render: args => (
    <StorySection title="Grid - Per-card LayoutItem flags: each card demonstrates a different behavior (static, isDraggable: false, isResizable: false, isBounded: false). Close text has been changed.">
      <Grid {...args} />
    </StorySection>
  ),
};
