import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileSearch, SquareArrowOutUpRight } from 'lucide-react';

import CtaPanel from '@/components/base/landing/cta-panel';
import { Button } from '@/components/base/shadcn/button';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Landing/Cta Panel',
  component: CtaPanel,
  args: {
    title: 'Documentation Center',
    description: 'For information on accessing, submitting and uploading data, visit our Documentation Center.',
  },
} satisfies Meta<typeof CtaPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="With icon, on a light surface">
        <div className="bg-muted max-w-md rounded-xl p-8">
          <CtaPanel
            icon={<FileSearch />}
            title="Documentation Center"
            description="For information on accessing, submitting and uploading data, visit our Documentation Center."
            footer={
              <Button asChild>
                <a href="#">
                  Documentation <SquareArrowOutUpRight />
                </a>
              </Button>
            }
          />
        </div>
      </StorySection>

      <StorySection title="No icon, on a primary surface (foreground adapts to theme)">
        <div className="bg-primary max-w-md rounded-xl p-8">
          <CtaPanel
            title={<span className="uppercase">Find inspiration</span>}
            description="Review published work that cites Kids First, then publish findings you've uncovered using this powerful resource."
            descriptionClassName="text-primary-foreground/90"
            className="text-primary-foreground"
            footer={
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href="#">
                  View publications <SquareArrowOutUpRight />
                </a>
              </Button>
            }
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
