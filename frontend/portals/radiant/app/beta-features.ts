import type { FeatureDefinitions } from '@/components/hooks/beta-feature-provider';

const commonFeatures: FeatureDefinitions = {
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
  onboarding: {
    type: 'boolean',
    defaultValue: false,
    label: 'Onboarding Wizard',
    description: "Enable onboarding wizard on case's variant tab page",
  },
};

const radiantFeatureDefinitions: FeatureDefinitions = {
  ...commonFeatures,
  analysis: {
    type: 'link',
    link: '/radiant/analysis',
    label: 'Analysis',
    description: 'Access analysis page',
  },
  study: {
    type: 'link',
    link: '/radiant/study',
    label: 'Studies',
    description: 'Access the new Studies page',
  },
  community: {
    type: 'link',
    link: '/radiant/community',
    label: 'Community',
    description: 'Access the new Community exploration page',
  },
};

const qlinFeatureDefinitions: FeatureDefinitions = commonFeatures;

const perTheme = {
  radiant: radiantFeatureDefinitions,
  include: radiantFeatureDefinitions,
  kf: radiantFeatureDefinitions,
  qlin: qlinFeatureDefinitions,
} as const;

export const featureDefinitions = perTheme[(import.meta.env.THEME ?? 'radiant') as keyof typeof perTheme];
