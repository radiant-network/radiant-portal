import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Cloud, Dna, SquareArrowOutUpRight } from 'lucide-react';

import ResourceTile from '@/components/base/landing/resource-tile';
import { Button } from '@/components/base/shadcn/button';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Landing/Resource Tile',
  component: ResourceTile,
  args: {
    title: 'Germline Variants',
    description:
      'Our variant explorer offers advanced searching capabilities. With just a few clicks, you can explore millions of annotated germline variants.',
  },
} satisfies Meta<typeof ResourceTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Tiles in a grid">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResourceTile
            title={
              <span className="flex items-center gap-3">
                <span className="text-primary [&_svg]:size-8">
                  <Dna />
                </span>
                Germline Variants
              </span>
            }
            description="Our variant explorer offers advanced searching capabilities to explore millions of annotated germline variants."
            footer={
              <Button asChild>
                <a href="#">
                  Explore variant data <ArrowRight />
                </a>
              </Button>
            }
          />
          <ResourceTile
            title={
              <span className="flex items-center gap-3">
                <span className="text-primary [&_svg]:size-8">
                  <Cloud />
                </span>
                CAVATICA
              </span>
            }
            description="A cloud-based platform designed for worldwide data analysis and collaboration."
            footer={
              <Button asChild variant="outline">
                <a href="#">
                  Get started <SquareArrowOutUpRight />
                </a>
              </Button>
            }
          />
        </div>
      </StorySection>

      <StorySection
        title="Colored card (className + descriptionClassName)"
        description="Override the card background and description color for a branded tile."
      >
        <div className="max-w-sm">
          <ResourceTile
            className="bg-primary text-primary-foreground border-0"
            descriptionClassName="text-primary-foreground/90"
            title={
              <span className="flex items-center gap-3">
                <span className="[&_svg]:size-8">
                  <Dna />
                </span>
                Germline Variants
              </span>
            }
            description="Explore millions of annotated germline variants from participant genomes."
            footer={
              <Button asChild variant="secondary">
                <a href="#">
                  Explore variant data <ArrowRight />
                </a>
              </Button>
            }
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
