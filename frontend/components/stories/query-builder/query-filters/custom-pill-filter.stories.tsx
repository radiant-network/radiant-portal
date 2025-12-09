import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SavedFilterType } from '@/api/api';
import CustomPillFilter from '@/components/base/query-filters/custom-pill-filter';

import { generateRandomUserSavedFilter } from '../utils';

const meta = {
  title: 'QueryBuilder/Query Filters/Custom Pill Filter',
  component: CustomPillFilter,
} satisfies Meta<typeof CustomPillFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as any, // No args needed for this story
  render: () => {
    // This is to simulate a dynamic list of custom pills
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [customPills, setCustomPills] = useState([
      generateRandomUserSavedFilter(),
      generateRandomUserSavedFilter(),
      generateRandomUserSavedFilter(),
    ]);

    return (
      <div className="rounded-sm border p-5 max-w-[300px]">
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
            setCustomPills(prev => prev.filter(pill => String(pill.id) !== String(pillId)));
          }}
          onSavePill={async pill =>
            // Simulate saving the pill
            new Promise(resolve => {
              setTimeout(() => {
                action('onSavePill')(pill);
                setCustomPills(prev => {
                  const existingPillIndex = prev.findIndex(p => p.id === pill.id);
                  if (existingPillIndex > -1) {
                    const updatedPills = [...prev];
                    updatedPills[existingPillIndex] = {
                      ...generateRandomUserSavedFilter(pill),
                      queries: pill.queries,
                      name: pill.name,
                    };
                    return updatedPills;
                  }
                  return prev;
                });
                resolve(pill as any);
              }, 1000);
            })
          }
          validateCustomPillTitle={() => new Promise(resolve => setTimeout(() => resolve(true), 750))}
          fetchSavedFiltersByCustomPillId={() => new Promise(resolve => setTimeout(() => resolve([]), 750))}
          learnMoreLink="https://google.com"
          savedFilterType={SavedFilterType.GERMLINE_SNV_OCCURRENCE}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: {} as any, // No args needed for this story
  render: () => (
    <div className="rounded-sm border p-5 max-w-[300px]">
      <CustomPillFilter
        customPills={[]}
        onSelectPill={(() => {}) as any}
        onDuplicatePill={(() => {}) as any}
        onDeletePill={() => {}}
        onSavePill={(() => {}) as any}
        validateCustomPillTitle={(() => {}) as any}
        fetchSavedFiltersByCustomPillId={(() => {}) as any}
        learnMoreLink="https://google.com"
        savedFilterType={SavedFilterType.GERMLINE_SNV_OCCURRENCE}
      />
    </div>
  ),
};
