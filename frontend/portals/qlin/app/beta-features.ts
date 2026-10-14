import type { FeatureDefinitions } from '@/components/hooks/beta-feature-provider';

export const qlinFeatureDefinitions: FeatureDefinitions = {
  orientation: {
    type: 'select',
    defaultValue: 'top',
    options: [
      { value: 'top', label: 'Top (Default)' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],
    label: 'Main Menu Orientation',
    description: 'Change the position of the main navigation menu',
  },
  analysis: {
    type: 'link',
    link: '/analysis',
    label: 'Analysis',
    description: 'Access analysis page',
  },
  study: {
    type: 'link',
    link: '/study',
    label: 'Studies',
    description: 'Access the new Studies page',
  },
  onboarding: {
    type: 'boolean',
    defaultValue: false,
    label: 'Onboarding Wizard',
    description: "Enable onboarding wizard on case's variant tab page",
  },
};
