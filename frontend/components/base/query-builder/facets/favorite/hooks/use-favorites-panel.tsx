import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { FavoritesContext, useFavorites } from './use-favorites';

const UNDO_WINDOW_MS = 500;
const SLIDE_OUT_MS = 200;

type FavoritesPanelContextValue = {
  removing: ReadonlySet<string>;
};

const FavoritesPanelContext = createContext<FavoritesPanelContextValue | null>(null);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function FavoritesPanelProvider({ children }: { children: ReactNode }) {
  const outer = useFavorites();
  const [pending, setPending] = useState<Set<string>>(() => new Set());
  const [removing, setRemoving] = useState<Set<string>>(() => new Set());
  const timers = useRef<Map<string, { undoId?: number; animId?: number }>>(new Map());

  const clearTimers = useCallback((key: string) => {
    const t = timers.current.get(key);
    if (!t) return;
    if (t.undoId !== undefined) clearTimeout(t.undoId);
    if (t.animId !== undefined) clearTimeout(t.animId);
    timers.current.delete(key);
  }, []);

  const cancelSchedule = useCallback(
    (key: string) => {
      clearTimers(key);
      setPending(prev => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setRemoving(prev => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    },
    [clearTimers],
  );

  const commitRemoval = useCallback(
    (key: string) => {
      outer.toggleFavorite(key);
      setPending(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setRemoving(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      timers.current.delete(key);
    },
    [outer],
  );

  const schedule = useCallback(
    (key: string) => {
      setPending(prev => new Set(prev).add(key));
      const reduced = prefersReducedMotion();
      const undoId = window.setTimeout(() => {
        if (reduced) {
          commitRemoval(key);
          return;
        }
        setRemoving(prev => new Set(prev).add(key));
        const animId = window.setTimeout(() => commitRemoval(key), SLIDE_OUT_MS);
        timers.current.set(key, { animId });
      }, UNDO_WINDOW_MS);
      timers.current.set(key, { undoId });
    },
    [commitRemoval],
  );

  const toggleFavorite = useCallback(
    (key: string) => {
      if (pending.has(key)) {
        cancelSchedule(key);
      } else if (outer.isFavorite(key)) {
        schedule(key);
      } else {
        outer.toggleFavorite(key);
      }
    },
    [pending, outer, cancelSchedule, schedule],
  );

  useEffect(() => {
    const snapshot = timers.current;
    return () => {
      snapshot.forEach(t => {
        if (t.undoId !== undefined) clearTimeout(t.undoId);
        if (t.animId !== undefined) clearTimeout(t.animId);
      });
      snapshot.clear();
    };
  }, []);

  const favoritesValue = useMemo(
    () => ({
      favorites: outer.favorites,
      isLoading: outer.isLoading,
      isError: outer.isError,
      retry: outer.retry,
      isFavorite: (key: string) => outer.isFavorite(key) && !pending.has(key),
      toggleFavorite,
    }),
    [outer, pending, toggleFavorite],
  );

  const panelValue = useMemo(() => ({ removing }), [removing]);

  return (
    <FavoritesContext value={favoritesValue}>
      <FavoritesPanelContext value={panelValue}>{children}</FavoritesPanelContext>
    </FavoritesContext>
  );
}

export function useFavoritesPanel(): FavoritesPanelContextValue {
  const ctx = useContext(FavoritesPanelContext);
  if (!ctx) throw new Error('useFavoritesPanel must be used within a FavoritesPanelProvider');
  return ctx;
}
