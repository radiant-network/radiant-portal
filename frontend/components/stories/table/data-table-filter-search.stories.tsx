import type { Meta, StoryObj } from '@storybook/react-vite';
import { SWRConfig } from 'swr';

import type { AutocompleteResult } from '@/api/api';
import TableFiltersSearch, {
  type AutocompleteApiFn,
} from '@/components/base/data-table/filters/data-table-filter-search';

import { StorySection } from '../story-section';

type AutocompleteResponse = Awaited<ReturnType<AutocompleteApiFn>>;

const RESULTS: AutocompleteResult[] = [
  { type: 'case_id', value: '1' },
  { type: 'case_id', value: '10' },
  { type: 'patient_id', value: '10' },
];

const resultsApi: AutocompleteApiFn = async () => ({ data: RESULTS }) as AutocompleteResponse;
const pendingApi: AutocompleteApiFn = () => new Promise(() => {});
const emptyApi: AutocompleteApiFn = async () => ({ data: [] }) as unknown as AutocompleteResponse;

const meta = {
  title: 'Features/Data Table/Filter Search',
  component: TableFiltersSearch,
  args: {
    placeholder: 'Case, sequencing, patient, or MRN',
    minSearchLength: 1,
    api: resultsApi,
    onSelect: () => {},
  },
  decorators: [
    Story => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <Story />
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof TableFiltersSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <StorySection title="Default" description="Type a character to see the results.">
      <TableFiltersSearch {...args} />
    </StorySection>
  ),
};

export const Loading: Story = {
  args: { api: pendingApi },
  render: args => (
    <StorySection title="Loading" description="Type a character: the request never resolves, so the spinner stays.">
      <TableFiltersSearch {...args} />
    </StorySection>
  ),
};

export const MinimumLength: Story = {
  args: { minSearchLength: 3 },
  render: args => (
    <StorySection title="Minimum length" description="Type 1 or 2 characters to see the minimum length message.">
      <TableFiltersSearch {...args} />
    </StorySection>
  ),
};

export const NoResult: Story = {
  args: { api: emptyApi },
  render: args => (
    <StorySection title="No result" description="Type a character: the request returns no result.">
      <TableFiltersSearch {...args} />
    </StorySection>
  ),
};
