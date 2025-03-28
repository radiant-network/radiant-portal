import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useI18n } from '@/components/hooks/i18n';

import ActionButton from "@/components/base/Buttons/ActionButton";
import { buttonColors, buttonVariants } from "./utils";

const meta = {
  title: "Base/Buttons/Action Button",
  component: ActionButton,
  tags: ["autodocs"],
  args: { onClick: fn(), size: "default", actions: [], onDefaultAction: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    children: "Button",
  },
  render: (args) => {
    const { t } = useI18n();
    return (
      <div className="flex flex-col gap-2">
        {buttonColors.map((color) => {
          return (
            <div className="flex gap-2">
              {buttonVariants.map((variant) => (
                <ActionButton
                  size="default"
                  color={color}
                  variant={variant}
                  {...args}
                >
                  {t(`common.buttons.variants.${variant}`)}
                </ActionButton>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
};

export const Sizes: Story = {
  args: {
    children: "Button",
  },
  render: (args) => {
    const { t } = useI18n();
    return (
      <div className="flex gap-2">
        <ActionButton {...args} size="default" color="primary">
          {t('common.buttons.sizes.default')}
        </ActionButton>
        <ActionButton {...args} size="xs" color="primary">
          {t('common.buttons.sizes.xs')}
        </ActionButton>
        <ActionButton {...args} size="sm" color="primary">
          {t('common.buttons.sizes.sm')}
        </ActionButton>
        <ActionButton {...args} size="md" color="primary">
          {t('common.buttons.sizes.md')}
        </ActionButton>
        <ActionButton {...args} size="lg" color="primary">
          {t('common.buttons.sizes.lg')}
        </ActionButton>
      </div>
    );
  },
};
