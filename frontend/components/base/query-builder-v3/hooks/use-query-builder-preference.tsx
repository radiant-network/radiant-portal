import { useEffect } from 'react';
import useSWR from 'swr';

import { UserPreference } from '@/api/api';
import { ApplicationId } from '@/components/cores/applications-config';
import { userPreferenceApi } from '@/utils/api';

import { DEFAULT_QBCONTEXT } from './use-query-builder';

type FetchUserPreferenceInput = {
  key: string;
};

type PostUserPreferenceInput = FetchUserPreferenceInput & {
  userPreference: UserPreference;
};

type useQueryBuilderGetPreferenceEffectProps = {
  appId: ApplicationId;
  setPreference: (value: any) => void;
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
 * Will return an 404 if the config has never been set before; will set an empty query-builder
 */
export function useQueryBuilderGetPreferenceEffect({ appId, setPreference }: useQueryBuilderGetPreferenceEffectProps) {
  const qbUserPreference = useSWR(
    `query-builder-get-${appId}`,
    () => fetchUserPreference({ key: `query-builder-${appId}` }),
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (qbUserPreference.data) {
      setPreference(qbUserPreference.data);
    } else if (qbUserPreference.error) {
      setPreference(DEFAULT_QBCONTEXT);
    }
  }, [qbUserPreference.isLoading]);
}
