import { useEffect } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { SavedFilter, SavedFilterType, UserPreference } from '@/api/api';
import { userPreferenceApi } from '@/utils/api';

import { getDefaultSavedFilterContext } from './use-saved-filter';

type FetchUserPreferenceInput = {
  key: string;
};

type PostUserPreferenceInput = FetchUserPreferenceInput & {
  userPreference: UserPreference;
};

type useSavedFilterGetPreferenceEffectProps = {
  savedFilterType: SavedFilterType;
  setPreference: (value: any) => void;
};

type useSavedFilterStateObserverProps = {
  savedFilterType: SavedFilterType;
  selectedSavedFilter: SavedFilter | undefined;
};

/**
 * Get user preference
 */
async function fetchUserPreference(input: FetchUserPreferenceInput) {
  const response = await userPreferenceApi.getUserPreferences(input.key);
  return response.data;
}

/**
 * Post user preference
 */
async function postUserPreference(_url: string, { arg }: { arg: PostUserPreferenceInput }) {
  const response = await userPreferenceApi.postUserPreferences(arg.key, arg.userPreference);
  return response.data;
}

/**
 * Load user preference
 * Will return an 404 if the config has never been set before; will set an empty saved-filters
 */
export function useSavedFilterGetPreferenceEffect({
  savedFilterType,
  setPreference,
}: useSavedFilterGetPreferenceEffectProps) {
  const savedFiltersPreference = useSWR(
    `saved-filters-get-${savedFilterType}`,
    () => fetchUserPreference({ key: `saved-filters-${savedFilterType}` }),
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (savedFiltersPreference.data) {
      // Extract selectedSavedFilter from content if it exists
      const selectedSavedFilter = (savedFiltersPreference.data.content as any)?.selectedSavedFilter;
      setPreference({
        ...getDefaultSavedFilterContext(),
        selectedSavedFilter,
      });
    } else if (savedFiltersPreference.error) {
      setPreference(getDefaultSavedFilterContext());
    }
  }, [savedFiltersPreference.isLoading]);
}

/**
 * Update user-preference of saved filters with a POST request
 * A debounce of 350 is used to prevent multiple post when use onChange event of data-table
 */
export function useSavedFiltersUpdatePreferenceEffect({
  savedFilterType,
  selectedSavedFilter,
}: useSavedFilterStateObserverProps) {
  const { trigger } = useSWRMutation(`saved-filters-post-${savedFilterType}`, postUserPreference);

  useEffect(() => {
    const handler = setTimeout(() => {
      trigger({
        key: `saved-filters-${savedFilterType}`,
        userPreference: {
          content: {
            selectedSavedFilter,
          },
          key: `saved-filters-${savedFilterType}`,
        },
      });
    }, 350);

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [selectedSavedFilter]);
}
