import { AlertCircle, ChevronRight, Star } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import type { AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { useFavorites } from './hooks/use-favorites';
import { resolveFavoriteFacets } from './libs/resolve-favorite-facets';
import FavoritesFacetList from './favorites-facet-list';

type FavoriteFacetSkeletonProps = {
  dimmed?: boolean;
  withStar?: boolean;
};

function FavoriteFacetSkeleton({ dimmed = false, withStar = false }: FavoriteFacetSkeletonProps) {
  return (
    <div
      className={cn(
        'relative w-[216px] max-w-full overflow-clip rounded-lg border border-border bg-card shadow-xs',
        dimmed && 'opacity-60',
      )}
    >
      <div className="relative flex h-8 items-center gap-2 p-2">
        <ChevronRight className="size-4 shrink-0 opacity-50" />
        <div className={cn('h-2 w-24 rounded-sm bg-primary', dimmed ? 'opacity-20' : 'opacity-10')} />
        {withStar && (
          <Star
            aria-hidden
            className="absolute right-1.5 top-1/2 size-3.5 -translate-y-1/2 fill-primary text-primary opacity-80"
          />
        )}
      </div>
    </div>
  );
}

function SkeletonStack() {
  return (
    <div className="isolate flex flex-col items-center gap-1 px-2 pt-2">
      <FavoriteFacetSkeleton dimmed />
      <FavoriteFacetSkeleton withStar />
      <FavoriteFacetSkeleton dimmed />
    </div>
  );
}

type FavoritesFacetCollectionProps = {
  aggregations: AggregationConfig;
};

function FavoritesFacetCollection({ aggregations }: FavoritesFacetCollectionProps) {
  const { t } = useI18n();
  const { favorites, isLoading, isError, retry } = useFavorites();

  if (isLoading) {
    return (
      <div data-cy="favorites-loading" className="flex w-full flex-col items-center p-6">
        <SkeletonStack />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        data-cy="favorites-error"
        role="alert"
        className="flex w-full flex-col items-center gap-6 whitespace-normal break-words p-6"
      >
        <SkeletonStack />
        <div className="flex w-full flex-col items-center gap-2 text-center text-sidebar-foreground opacity-80">
          <p className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold">
            <span>{t('query_filters.favorites.error.title')}</span>
            <AlertCircle aria-hidden className="size-4 shrink-0 text-destructive" />
          </p>
          <p className="w-full text-xs opacity-75">{t('query_filters.favorites.error.description')}</p>
        </div>
        <Button data-cy="favorites-retry" size="sm" variant="outline" onClick={retry}>
          {t('query_filters.favorites.error.retry')}
        </Button>
      </div>
    );
  }

  const fields = resolveFavoriteFacets(favorites, aggregations);

  if (fields.length === 0) {
    return (
      <div
        data-cy="favorites-empty"
        className="flex w-full flex-col items-center gap-6 whitespace-normal break-words p-6"
      >
        <SkeletonStack />
        <div className="flex w-full flex-col items-center gap-2 text-center text-sidebar-foreground opacity-70">
          <p className="w-full text-sm font-semibold opacity-75">{t('query_filters.favorites.empty.title')}</p>
          <p className="w-full text-xs opacity-75">{t('query_filters.favorites.empty.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div data-cy="favorites-populated">
      <FavoritesFacetList fields={fields} />
    </div>
  );
}

export default FavoritesFacetCollection;
