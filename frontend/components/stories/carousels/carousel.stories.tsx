import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent } from '@/components/base/shadcn/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/base/shadcn/carousel';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Carousel/Carousel',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

const SLIDES = [1, 2, 3, 4, 5];

function Slide({ n }: { n: number }) {
  return (
    <Card>
      <CardContent className="flex aspect-video items-center justify-center p-6">
        <span className="text-3xl font-semibold">{n}</span>
      </CardContent>
    </Card>
  );
}

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Default (one slide per view)"
        description="Side arrows are absolutely positioned outside the track."
      >
        {/* Horizontal padding leaves room for the default -left-12 / -right-12 arrows. */}
        <div className="px-14">
          <Carousel opts={{ align: 'start' }} className="mx-auto w-full max-w-sm">
            <CarouselContent>
              {SLIDES.map(n => (
                <CarouselItem key={n}>
                  <Slide n={n} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </StorySection>

      <StorySection
        title="Multiple slides per view"
        description="Control how many slides show via the CarouselItem basis (here basis-1/2 · sm:basis-1/3)."
      >
        <div className="px-14">
          <Carousel opts={{ align: 'start' }} className="mx-auto w-full max-w-2xl">
            <CarouselContent>
              {SLIDES.map(n => (
                <CarouselItem key={n} className="basis-1/2 sm:basis-1/3">
                  <Slide n={n} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </StorySection>

      <StorySection
        title="Arrows below the track"
        description="Reset the absolute positioning with `static translate-y-0` to place the controls in normal flow (used on the landing Studies carousel)."
      >
        <Carousel opts={{ align: 'start' }} className="mx-auto w-full max-w-sm">
          <CarouselContent>
            {SLIDES.map(n => (
              <CarouselItem key={n}>
                <Slide n={n} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex justify-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </StorySection>
    </StoryShowcase>
  ),
};
