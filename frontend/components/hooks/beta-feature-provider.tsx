import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type FeatureDefinition = {
  defaultValue: boolean | string;
  options?: { value: string; label: string }[];
  label: string;
  description?: string;
};

type BetaFeatures = {
  [key: string]: boolean | string;
};

type FeatureDefinitions = {
  [key: string]: FeatureDefinition;
};

type BetaFeatureContextType = {
  features: BetaFeatures;
  setFeature: (key: string, value: boolean | string) => void;
  featureDefinitions: FeatureDefinitions;
};

const defaultFeatureDefinitions: FeatureDefinitions = {
  orientation: {
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
