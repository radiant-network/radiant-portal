import type { FeatureDefinitions } from '@/components/hooks/beta-feature-provider';

export const radiantFeatureDefinitions: FeatureDefinitions = {
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
  landingInclude: {
    type: 'link',
    link: '/landing/include',
    label: 'Landing (Include)',
    description: 'Access the Include landing page',
  },
  landingKidsfirst: {
    type: 'link',
    link: '/landing/kidsfirst',
    label: 'Landing (Kids First)',
    description: 'Access the Kids First landing page',
  },
  study: {
    type: 'link',
    link: '/study',
    label: 'Studies',
    description: 'Access the new Studies page',
  },
  community: {
    type: 'link',
    link: '/community',
    label: 'Community',
    description: 'Access the new Community exploration page',
  },
  onboarding: {
    type: 'boolean',
    defaultValue: false,
    label: 'Onboarding Wizard',
    description: "Enable onboarding wizard on case's variant tab page",
  },
};
