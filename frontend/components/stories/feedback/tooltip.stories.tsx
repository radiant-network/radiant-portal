import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { Button } from '@/components/base/ui/button';

const meta = {
  title: 'Feedback/Tooltip',
  component: TooltipContent,
  args: {
    children: 'Tooltip Content',
    sideOffset: 8,
    side: 'top',
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <div className="flex flex-col gap-6 justify-center p-24">
        <div className='flex justify-center'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button color="primary">Hover Me</Button>
            </TooltipTrigger>
            <TooltipContent {...args} />
          </Tooltip>
        </div>
        <div className='flex justify-center'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button color="primary">Hover Me (long text)</Button>
            </TooltipTrigger>
            <TooltipContent>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non porta neque imperdiet.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  },
};
