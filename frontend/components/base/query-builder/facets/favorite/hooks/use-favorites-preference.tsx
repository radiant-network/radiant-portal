import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type { UserPreference } from '@/api/api';
import type { ApplicationId } from '@/components/cores/applications-config';
import { userPreferenceApi } from '@/utils/api';

type FavoritesContent = {
  favorites: string[];
};

function preferenceKey(appId: ApplicationId) {
  return `favorites-${appId}`;
}

async function fetchFavoritesPreference(key: string) {
  const response = await userPreferenceApi.getUserPreferences(key);
  return response.data;
}

async function postFavoritesPreference(_url: string, { arg }: { arg: { key: string; favorites: string[] } }) {
  const userPreference: UserPreference = {
    key: arg.key,
    content: { favorites: arg.favorites },
  };
  const response = await userPreferenceApi.postUserPreferences(arg.key, userPreference);
  return response.data;
}

export function useFavoritesPreference(appId: ApplicationId) {
  const key = preferenceKey(appId);

  const { data, isLoading, error, mutate } = useSWR(`favorites-get-${appId}`, () => fetchFavoritesPreference(key), {
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const { trigger } = useSWRMutation(`favorites-get-${appId}`, postFavoritesPreference);

  const favorites = (data?.content as FavoritesContent | undefined)?.favorites ?? [];
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
  const isNotFound = status === 404;
  const isError = Boolean(error) && !isNotFound;

  async function saveFavorites(nextFavorites: string[]) {
    await trigger({ key, favorites: nextFavorites });
    await mutate();
  }

  return {
    favorites,
    isLoading: isLoading && !error,
    isError,
    retry: () => mutate(),
    saveFavorites,
  };
}
