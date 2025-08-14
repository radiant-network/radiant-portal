import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent } from '@/components/base/ui/card';
import { Indicator } from '@/components/base/ui/indicator';

import { indicatorVariants } from '../badges/utils';

const meta = {
  title: 'Indicators/Indicator',
  component: Indicator,
  args: {},
} satisfies Meta<typeof Indicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    variant: 'red',
  },
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {indicatorVariants
        .filter((v): v is NonNullable<typeof v> => v !== undefined)
        .map(variant => (
          <div key={variant}>
            <Indicator variant={variant} symbol="triangle-up" />
            <Indicator variant={variant} symbol="triangle-down" />
            <Indicator variant={variant} symbol="diamond" />
            <Indicator variant={variant} symbol="circle" />

            <Indicator variant={variant} symbol="triangle-up" size="sm" />
            <Indicator variant={variant} symbol="triangle-down" size="sm" />
            <Indicator variant={variant} symbol="diamond" size="sm" />
            <Indicator variant={variant} symbol="circle" size="sm" />
          </div>
        ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    variant: 'red',
  },
  render: () => (
    <div className="flex flex-col items-start gap-2">
      {indicatorVariants
        .filter((v): v is NonNullable<typeof v> => v !== undefined)
        .map(variant => (
          <div key={variant}>
            <Indicator variant={variant} symbol="triangle-up">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="triangle-down">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="diamond">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="circle">
              <span>Text</span>
            </Indicator>

            <Indicator variant={variant} symbol="triangle-up" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="triangle-down" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="diamond" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="circle" size="sm">
              <span>Text</span>
            </Indicator>
          </div>
        ))}
    </div>
  ),
};
