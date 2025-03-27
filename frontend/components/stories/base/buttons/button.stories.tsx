import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useI18n } from '@/components/hooks/i18n';

import { Button } from '@/components/base/ui/button';
import { buttonColors, buttonVariants } from './utils';

const meta = {
  title: 'Base/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn(), size: 'default' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
  render: () => {
    const { t } = useI18n();
    return (
      <div className="flex flex-col gap-2">
        {buttonColors.map(color => {
          return (
            <div className="flex gap-2">
              {buttonVariants.map(variant => (
                <Button color={color} variant={variant}>
                  {t(`common.buttons.variants.${variant}`)}
                </Button>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {},
  render: () => {
    const { t } = useI18n();
    return (
      <div className="flex gap-2">
        <Button size="default" color="primary">
          {t('common.buttons.sizes.default')}
        </Button>
        <Button size="xs" color="primary">
          {t('common.buttons.sizes.xs')}
        </Button>
        <Button size="sm" color="primary">
          {t('common.buttons.sizes.sm')}
        </Button>
        <Button size="md" color="primary">
          {t('common.buttons.sizes.md')}
        </Button>
        <Button size="lg" color="primary">
          {t('common.buttons.sizes.lg')}
        </Button>
      </div>
    );
  },
};
