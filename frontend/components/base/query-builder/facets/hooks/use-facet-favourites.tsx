import { createContext, useCallback, useContext, useMemo } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import type { UserPreference } from '@/api/api';
import type { ApplicationId } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { userPreferenceApi } from '@/utils/api';

export const FAVOURITES_GROUP_KEY = 'favourites';

type FacetFavouritesContextProps = {
  favourites: string[];
  isFavourite: (facetKey: string) => boolean;
  toggleFavourite: (facetKey: string) => Promise<void>;
};

const FacetFavouritesContext = createContext<FacetFavouritesContextProps | undefined>(undefined);

function getPreferenceKey(appId: ApplicationId) {
  return `facet-favourites-${appId}`;
}

function toUserPreference(key: string, favourites: string[]): UserPreference {
  return { key, content: { favourites } };
}

async function fetchFavourites(key: string) {
  const response = await userPreferenceApi.getUserPreferences(key);
  return response.data;
}

async function postFavourites(key: string, favourites: string[]) {
  const response = await userPreferenceApi.postUserPreferences(key, toUserPreference(key, favourites));
  return response.data;
}

type FacetFavouritesProviderProps = {
  appId: ApplicationId;
  children: React.ReactNode;
};

/**
 * Favourite facets of the current user, saved per application in user preferences.
 * A 404 means nothing has been saved yet and is treated as an empty list.
 */
export function FacetFavouritesProvider({ appId, children }: FacetFavouritesProviderProps) {
  const { t } = useI18n();
  const key = getPreferenceKey(appId);
  const { data, mutate } = useSWR(`facet-favourites-get-${appId}`, () => fetchFavourites(key), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const favourites = useMemo(() => {
    const content = data?.content as { favourites?: unknown } | undefined;
    return Array.isArray(content?.favourites) ? (content.favourites as string[]) : [];
  }, [data]);

  const isFavourite = useCallback((facetKey: string) => favourites.includes(facetKey), [favourites]);

  const toggleFavourite = useCallback(
    async (facetKey: string) => {
      const wasFavourite = favourites.includes(facetKey);
      const next = wasFavourite ? favourites.filter(k => k !== facetKey) : [...favourites, facetKey];

      try {
        await mutate(postFavourites(key, next), {
          optimisticData: toUserPreference(key, next),
          populateCache: () => toUserPreference(key, next),
          rollbackOnError: true,
          revalidate: false,
        });
      } catch {
        toast.error(
          wasFavourite
            ? t('query_filters.favourites.notifications.errors.remove')
            : t('query_filters.favourites.notifications.errors.add'),
        );
      }
    },
    [favourites, key, mutate, t],
  );

  const value = useMemo(
    () => ({ favourites, isFavourite, toggleFavourite }),
    [favourites, isFavourite, toggleFavourite],
  );

  return <FacetFavouritesContext value={value}>{children}</FacetFavouritesContext>;
}

/**
 * Returns undefined outside of a FacetFavouritesProvider, so favourites stay opt-in.
 */
export function useFacetFavourites() {
  return useContext(FacetFavouritesContext);
}
