import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { Button } from "@/components/base/ui/button";

const meta = {
  title: "Base/Overlays/Tooltip",
  component: TooltipContent,
  args: {
    children: "Tooltip Content",
    sideOffset: 8,
    side: "top",
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="flex justify-center p-24">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="primary">Hover Me</Button>
          </TooltipTrigger>
          <TooltipContent {...args} />
        </Tooltip>
      </div>
    );
  },
};
