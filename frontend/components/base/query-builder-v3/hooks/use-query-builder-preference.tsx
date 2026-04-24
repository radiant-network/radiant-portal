import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { UserPreference } from '@/api/api';
import { ApplicationId } from '@/components/cores/applications-config';
import { userPreferenceApi } from '@/utils/api';

import { ISyntheticSqon } from '../type';

import { getDefaultQBContext, IQBContext } from './use-query-builder';

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

type useSqonsQBStateObserverProps = {
  appId: ApplicationId;
  sqons: ISyntheticSqon[];
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
      setPreference({ ...getDefaultQBContext(), ...(qbUserPreference.data.content as Partial<IQBContext>) });
    } else if (qbUserPreference.error) {
      setPreference(getDefaultQBContext());
    }
  }, [qbUserPreference.isLoading]);
}

/**
 * Update user-preference of saved filters with a POST request
 * A debounce of 350 is used to prevent multiple post when use onChange event of data-table
 */
export function useSqonsQBUpdatePreferenceEffect({ appId, sqons }: useSqonsQBStateObserverProps) {
  const qbUserPreference = useSWR(
    `query-builder-get-${appId}`,
    () => fetchUserPreference({ key: `query-builder-${appId}` }),
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );
  const { trigger } = useSWRMutation(`query-builder-post-${appId}`, postUserPreference);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      trigger({
        key: `query-builder-${appId}`,
        userPreference: {
          content: {
            ...qbUserPreference.data?.content,
            sqons,
          },
          key: `query-builder-${appId}`,
        },
      });
    }, 350);

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [sqons]);
}
