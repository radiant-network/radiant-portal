import { createContext, useCallback, useContext, useMemo } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import type { UserPreference } from '@/api/api';
import type { ApplicationId } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { userPreferenceApi } from '@/utils/api';

export const FAVORITES_GROUP_KEY = 'favorites';

type FacetFavoritesContextProps = {
  favorites: string[];
  isLoading: boolean;
  isFavorite: (facetKey: string) => boolean;
  toggleFavorite: (facetKey: string) => Promise<void>;
};

const FacetFavoritesContext = createContext<FacetFavoritesContextProps | undefined>(undefined);

function getPreferenceKey(appId: ApplicationId) {
  return `facet-favorites-${appId}`;
}

function toUserPreference(key: string, favorites: string[]): UserPreference {
  return { key, content: { favorites } };
}

async function fetchFavorites(key: string) {
  const response = await userPreferenceApi.getUserPreferences(key);
  return response.data;
}

async function postFavorites(key: string, favorites: string[]) {
  const response = await userPreferenceApi.postUserPreferences(key, toUserPreference(key, favorites));
  return response.data;
}

type FacetFavoritesProviderProps = {
  appId: ApplicationId;
  children: React.ReactNode;
};

/**
 * Favorite facets of the current user, saved per application in user preferences.
 * A 404 means nothing has been saved yet and is treated as an empty list.
 */
export function FacetFavoritesProvider({ appId, children }: FacetFavoritesProviderProps) {
  const { t } = useI18n();
  const key = getPreferenceKey(appId);
  const { data, isLoading, mutate } = useSWR(`facet-favorites-get-${appId}`, () => fetchFavorites(key), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const favorites = useMemo(() => {
    const content = data?.content as { favorites?: unknown } | undefined;
    return Array.isArray(content?.favorites) ? (content.favorites as string[]) : [];
  }, [data]);

  const isFavorite = useCallback((facetKey: string) => favorites.includes(facetKey), [favorites]);

  const toggleFavorite = useCallback(
    async (facetKey: string) => {
      const wasFavorite = favorites.includes(facetKey);
      const next = wasFavorite ? favorites.filter(k => k !== facetKey) : [...favorites, facetKey];

      try {
        await mutate(postFavorites(key, next), {
          optimisticData: toUserPreference(key, next),
          populateCache: () => toUserPreference(key, next),
          rollbackOnError: true,
          revalidate: false,
        });
      } catch {
        toast.error(
          wasFavorite
            ? t('query_filters.favorites.notifications.errors.remove')
            : t('query_filters.favorites.notifications.errors.add'),
        );
      }
    },
    [favorites, key, mutate, t],
  );

  const value = useMemo(
    () => ({ favorites, isLoading, isFavorite, toggleFavorite }),
    [favorites, isLoading, isFavorite, toggleFavorite],
  );

  return <FacetFavoritesContext value={value}>{children}</FacetFavoritesContext>;
}

/**
 * Returns undefined outside of a FacetFavoritesProvider, so favorites stay opt-in.
 */
export function useFacetFavorites() {
  return useContext(FacetFavoritesContext);
}
