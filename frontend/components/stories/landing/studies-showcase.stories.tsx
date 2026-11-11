import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpenText, Users } from 'lucide-react';

import StudiesShowcase, { StudiesAccent } from '@/components/base/landing/studies-showcase';
import { Badge } from '@/components/base/shadcn/badge';
import StatItem from '@/components/base/stat-item/stat-item';

import { StorySection, StoryShowcase } from '../story-section';

type DemoStudy = { name: string; description: string; participants: string; domain: string };

const demoStudies: DemoStudy[] = [
  {
    name: "Children's Brain Tumor Network",
    description:
      'A multi-institutional international clinical research consortium created to advance therapeutic development through open-science research platforms.',
    participants: '1,024',
    domain: 'Cancer',
  },
  {
    name: 'Kids First: Orofacial Cleft',
    description:
      'Whole-genome sequencing of families affected by orofacial clefts to uncover the genetic basis of these structural birth defects.',
    participants: '2,310',
    domain: 'Congenital disorder',
  },
];

/** Slide content is provided by the consumer; `light` adapts its colors for a colored (accent) carousel. */
function renderSlide(study: DemoStudy, light = false) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className={`text-xl font-bold tracking-tight ${light ? 'text-primary-foreground' : 'text-primary'}`}>
        {study.name}
      </h3>
      <p className={`text-sm ${light ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{study.description}</p>
      <div className="flex items-center gap-6">
        <StatItem
          icon={<Users />}
          value={study.participants}
          label="Participants"
          iconClassName={light ? 'text-primary-foreground' : undefined}
          labelClassName={light ? 'text-primary-foreground/90' : undefined}
        />
        <Badge variant="secondary" className="shrink-0 uppercase">
          {study.domain}
        </Badge>
      </div>
    </div>
  );
}

/** Functions use `unknown` params (+ cast) so they satisfy the generic component's inferred prop types. */
const commonProps = {
  icon: <BookOpenText />,
  count: 8,
  label: 'Studies',
  description:
    'Explore a broad collection of harmonized studies focused on pediatric cancer and structural birth defects.',
  ctaLabel: 'View all studies',
  items: demoStudies,
  getItemKey: (study: unknown) => (study as DemoStudy).name,
  renderItem: (study: unknown) => renderSlide(study as DemoStudy),
};

const meta = {
  title: 'Components/Landing/Studies Showcase',
  component: StudiesShowcase,
} satisfies Meta<typeof StudiesShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: commonProps,
  render: () => (
    <StoryShowcase>
      <StorySection title='accent="panel" (default) — blue side panel, light carousel'>
        <StudiesShowcase {...commonProps} renderItem={study => renderSlide(study as DemoStudy)} />
      </StorySection>

      <StorySection title='accent="carousel" — grey side panel, blue carousel'>
        <StudiesShowcase
          {...commonProps}
          accent={StudiesAccent.Carousel}
          renderItem={study => renderSlide(study as DemoStudy, true)}
        />
      </StorySection>
    </StoryShowcase>
  ),
};
