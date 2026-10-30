import type { Meta, StoryObj } from '@storybook/react-vite';

import ScrollableTabsList from '@/components/base/navigation/scrollable-tabs-list';
import { Tabs, TabsContent, TabsTrigger } from '@/components/base/shadcn/tabs';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Tabs/Scrollable Tabs List',
  component: ScrollableTabsList,
} satisfies Meta<typeof ScrollableTabsList>;

export default meta;

type Story = StoryObj<typeof meta>;

const MEMBERS = ['Proband (Mother)', 'Fetus 1', 'Fetus 2', 'Fetus 3', 'Father'];

// The chevrons are driven by a measurement, so a story only shows them if the strip is genuinely
// too narrow for its tabs. Each case therefore pins a width rather than describing one.
function Strip({ width, tabs = MEMBERS }: { width: number; tabs?: string[] }) {
  return (
    <div style={{ width }}>
      <Tabs defaultValue={tabs[0]}>
        <ScrollableTabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {tabs.map(tab => (
          <TabsContent key={tab} value={tab} className="bg-muted px-3 py-2 rounded-md">
            {tab} content.
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export const Overview: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Fits" description="No overflow: the chevrons stay out and nothing is masked.">
        <Strip width={640} />
      </StorySection>

      <StorySection
        title="Overflows"
        description="Both chevrons appear. The left one is disabled at the start, and the right edge fades out over the tabs still to come. Use the chevrons to page through and watch the states swap."
      >
        <Strip width={320} />
      </StorySection>

      <StorySection title="Two tabs" description="A strip narrow enough to overflow even a short list.">
        <div className="flex flex-col gap-2">
          <StoryLabel>Wide enough</StoryLabel>
          <Strip width={420} tabs={['Proband (Mother)', 'Father']} />
          <StoryLabel>Too narrow</StoryLabel>
          <Strip width={180} tabs={['Proband (Mother)', 'Father']} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
