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

export type FeatureDefinitions = {
  [key: string]: FeatureBooleanDefinition | FeatureSelectDefinition | FeatureLinkDefinition;
};

type BetaFeatureContextType = {
  features: BetaFeatures;
  setFeature: (key: string, value: boolean | string) => void;
  featureDefinitions: FeatureDefinitions;
};

export const defaultFeatureDefinitions: FeatureDefinitions = {
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
  patient: {
    type: 'boolean',
    defaultValue: false,
    label: 'Patient View',
    description: 'Show the Patients entry in the main navigation menu',
  },
};

const BetaFeatureContext = createContext<BetaFeatureContextType | undefined>(undefined);

// `link` features are shortcuts rather than toggles: they carry no defaultValue.
const buildDefaultFeatures = (definitions: FeatureDefinitions): BetaFeatures =>
  Object.entries(definitions).reduce<BetaFeatures>(
    (acc, [key, def]) => (def.type === 'link' ? acc : { ...acc, [key]: def.defaultValue }),
    {},
  );

type BetaFeatureProviderProps = {
  children: ReactNode;
  definitions?: FeatureDefinitions;
  storageKey?: string;
};

export const BetaFeatureProvider = ({
  children,
  definitions = defaultFeatureDefinitions,
  storageKey = 'betaFeatures',
}: BetaFeatureProviderProps) => {
  const [features, setFeatures] = useState<BetaFeatures>(() => {
    if (typeof window === 'undefined') {
      return buildDefaultFeatures(definitions);
    }

    const savedFeatures = localStorage.getItem(storageKey);
    if (savedFeatures) {
      try {
        return JSON.parse(savedFeatures);
      } catch {
        return buildDefaultFeatures(definitions);
      }
    }
    return buildDefaultFeatures(definitions);
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(features));
  }, [features, storageKey]);

  const setFeature = (key: string, value: boolean | string) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <BetaFeatureContext.Provider value={{ features, setFeature, featureDefinitions: definitions }}>
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
