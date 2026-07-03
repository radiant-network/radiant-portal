import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type FeatureBooleanDefinition = {
  type: 'boolean';
  defaultValue: boolean;
  label: string;
  description?: string;
};

type FeatureSelectDefinition = {
  type: 'select';
  defaultValue: string;
  options: { value: string; label: string }[];
  label: string;
  description?: string;
};

type FeatureLinkDefinition = {
  type: 'link';
  link: string;
  label: string;
  description?: string;
};

type BetaFeatures = {
  [key: string]: boolean | string;
};

type FeatureDefinitions = {
  [key: string]: FeatureBooleanDefinition | FeatureSelectDefinition | FeatureLinkDefinition;
};

type BetaFeatureContextType = {
  features: BetaFeatures;
  setFeature: (key: string, value: boolean | string) => void;
  featureDefinitions: FeatureDefinitions;
};

const defaultFeatureDefinitions: FeatureDefinitions = {
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
  // Add more feature definitions here
  // QA preview only: two links to view both landing variants in a single build.
  // In prod the variant should be driven by the build THEME on a single `/landing`
  // route, so these links and the `/landing/*` preview routes should be removed.
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

const BetaFeatureContext = createContext<BetaFeatureContextType | undefined>(undefined);

export const BetaFeatureProvider = ({ children }: { children: ReactNode }) => {
  const [features, setFeatures] = useState<BetaFeatures>(() => {
    if (typeof window === 'undefined') {
      return Object.entries(defaultFeatureDefinitions).reduce(
        (acc, [key, def]) => ({
          ...acc,
          [key]: def.defaultValue,
        }),
        {},
      );
    }

    const savedFeatures = localStorage.getItem('betaFeatures');
    if (savedFeatures) {
      try {
        return JSON.parse(savedFeatures);
      } catch {
        return Object.entries(defaultFeatureDefinitions).reduce(
          (acc, [key, def]) => ({
            ...acc,
            [key]: def.defaultValue,
          }),
          {},
        );
      }
    }
    return Object.entries(defaultFeatureDefinitions).reduce(
      (acc, [key, def]) => ({
        ...acc,
        [key]: def.defaultValue,
      }),
      {},
    );
  });

  useEffect(() => {
    localStorage.setItem('betaFeatures', JSON.stringify(features));
  }, [features]);

  const setFeature = (key: string, value: boolean | string) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <BetaFeatureContext.Provider value={{ features, setFeature, featureDefinitions: defaultFeatureDefinitions }}>
      {children}
    </BetaFeatureContext.Provider>
  );
};

export const useBetaFeatures = () => {
  const context = useContext(BetaFeatureContext);
  if (context === undefined) {
    throw new Error('useBetaFeatures must be used within a BetaFeatureProvider');
  }
  return context;
};
