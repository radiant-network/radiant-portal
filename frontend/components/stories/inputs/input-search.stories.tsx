import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import InputSearch from '@/components/base/data-entry/input-search';

import { StoryLabel, StorySection } from '../story-section';

import { sizes } from './utils';

const meta = {
  title: 'Components/Inputs/Input Search',
  component: InputSearch,
  args: {
    value: 'Search value',
    onSearch: fn(),
    onChange: fn(),
    placeholder: 'Placeholder',
    searchButtonProps: {},
  },
} satisfies Meta<typeof InputSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <StorySection title="Sizes">
      {sizes.map(size => (
        <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <InputSearch
            size={size}
            onChange={e => action('onChange')(e)}
            onSearch={value => {
              action('onSearch')(value);
            }}
            className="max-w-[300px]"
            placeholder="Placeholder"
            autoFocus
            searchButtonProps={{
              color: 'primary',
              variant: 'default',
            }}
          />
        </div>
      ))}
    </StorySection>
  ),
};
