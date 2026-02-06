import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import InputSearch from '@/components/base/data-entry/input-search';

import { sizes } from './utils';

const meta = {
  title: 'Inputs/Input Search',
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

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {sizes.map(size => (
        <div key={size}>
          <span>{size}</span>
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
    </div>
  ),
};

export const Async: Story = {
  render: () => (
    <InputSearch
      onChange={e => action('onChange')(e)}
      onSearch={value => {
        action('onSearch')(value);
        return new Promise(resolve => setTimeout(() => resolve(), 1000));
      }}
      className="max-w-[300px]"
      placeholder="Placeholder"
      autoFocus
      searchButtonProps={{
        color: 'primary',
        variant: 'default',
      }}
    />
  ),
};
