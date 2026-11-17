import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { ApplicationId } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import { useFavoritesPreference } from './use-favorites-preference';

export type FavoritesContextValue = {
  favorites: ReadonlySet<string>;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (key: string) => void;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ appId, children }: { appId: ApplicationId; children: ReactNode }) {
  const { t } = useI18n();
  const { favorites: initialFavorites, isLoading, isError, retry, saveFavorites } = useFavoritesPreference(appId);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isLoading && !hydrated) {
      setFavorites(new Set(initialFavorites));
      setHydrated(true);
    }
  }, [isLoading, hydrated, initialFavorites]);

  const isFavorite = useCallback((key: string) => favorites.has(key), [favorites]);

  const toggleFavorite = useCallback(
    async (key: string) => {
      const previous = favorites;
      const wasFavorite = previous.has(key);
      const next = new Set(previous);
      if (wasFavorite) next.delete(key);
      else next.add(key);
      setFavorites(next);

      try {
        await saveFavorites(Array.from(next));
      } catch {
        setFavorites(previous);
        toast.error(
          t(wasFavorite ? 'query_filters.favorites.toast.error_remove' : 'query_filters.favorites.toast.error_add'),
        );
      }
    },
    [favorites, saveFavorites, t],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, isLoading: isLoading || !hydrated, isError, retry }),
    [favorites, isFavorite, toggleFavorite, isLoading, hydrated, isError, retry],
  );

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
}
