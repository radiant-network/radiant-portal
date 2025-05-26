import type { Meta, StoryObj } from '@storybook/react';
import CustomPillFilter from '@/components/feature/query-filters/custom-pill-filter';
import { generateRandomUserSavedFilter } from '../query-builder/utils';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

const meta = {
  title: 'Feature/Query Filters/Custom Pill Filter',
  component: CustomPillFilter,
} satisfies Meta<typeof CustomPillFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as any, // No args needed for this story
  render: () => {
    // This is to simulate a dynamic list of custom pills
    const [customPills, setCustomPills] = useState([
      generateRandomUserSavedFilter(),
      generateRandomUserSavedFilter(),
      generateRandomUserSavedFilter(),
    ]);

    return (
      <CustomPillFilter
        customPills={customPills}
        onSelectPill={action('onSelectPill')}
        onDuplicatePill={pill => {
          action('onDuplicatePill');
          setCustomPills(prev => [
            ...prev,
            {
              ...generateRandomUserSavedFilter(pill),
              queries: pill.queries,
            },
          ]);
        }}
        onDeletePill={pillId => {
          action('onDeletePill')();
          setCustomPills(prev => prev.filter(pill => pill.id !== pillId));
        }}
        onSavePill={async pill => {
          // Simulate saving the pill
          return new Promise(resolve => {
            setTimeout(() => {
              action('onSavePill')(pill);
              setCustomPills(prev => {
                const existingPillIndex = prev.findIndex(p => p.id === pill.id);
                if (existingPillIndex > -1) {
                  const updatedPills = [...prev];
                  updatedPills[existingPillIndex] = {
                    ...generateRandomUserSavedFilter(pill),
                    queries: pill.queries,
                    title: pill.title,
                  };
                  return updatedPills;
                }
                return prev;
              });
              resolve(pill as any);
            }, 1000);
          });
        }}
      />
    );
  },
};
