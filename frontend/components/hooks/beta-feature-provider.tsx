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
  query_builder: {
    type: 'link',
    link: '/query-builder-v3/1?seq_id=1',
    label: 'Query Builder V3',
    description: 'Preview of the new Query Builder',
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
