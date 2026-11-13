import { useState } from 'react';
import { Star, StarOff } from 'lucide-react';

import { useFacetFavorites } from '@/components/base/query-builder/facets/hooks/use-facet-favorites';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type FavoriteButtonProps = {
  facetKey: string;
  label: string;
};

/**
 * Star toggle shown in a facet header. Hidden until the header (group/facet-header) is hovered,
 * unless the facet is already a favorite, the button has keyboard focus, or it sits in the Favorites panel.
 */
export function FavoriteButton({ facetKey, label }: FavoriteButtonProps) {
  const { t } = useI18n();
  const favorites = useFacetFavorites();
  // Holds the resting look after a click, so the hover preview doesn't show the opposite action under the pointer
  const [isSettling, setIsSettling] = useState(false);

  if (!favorites) return null;

  const isFavorite = favorites.isFavorite(facetKey);
  const showHover = !isSettling;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="2xs"
          iconOnly
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? t('a11y.facet_favorite.remove', { facet: label })
              : t('a11y.facet_favorite.add', { facet: label })
          }
          data-cy={`facet-favorite-${facetKey}`}
          onClick={() => {
            setIsSettling(true);
            favorites.toggleFavorite(facetKey);
          }}
          onPointerLeave={() => setIsSettling(false)}
          onBlur={() => setIsSettling(false)}
          className={cn(
            'group/favorite text-foreground hover:bg-transparent hover:text-foreground [&_svg]:size-3',
            !isFavorite &&
              'opacity-0 group-hover/facet-header:opacity-100 focus-visible:opacity-100 in-data-facet-favorites-panel:opacity-100',
          )}
        >
          {isFavorite ? (
            <>
              <Star
                className={cn(
                  'fill-current opacity-80',
                  showHover && 'group-hover/favorite:hidden group-focus-visible/favorite:hidden',
                )}
              />
              <StarOff
                className={cn('hidden', showHover && 'group-hover/favorite:block group-focus-visible/favorite:block')}
              />
            </>
          ) : (
            <Star
              className={cn(
                'opacity-50',
                showHover &&
                  'group-hover/favorite:fill-current group-hover/favorite:text-accent-foreground group-focus-visible/favorite:fill-current group-focus-visible/favorite:text-accent-foreground',
              )}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFavorite ? t('query_filters.favorites.tooltip.remove') : t('query_filters.favorites.tooltip.add')}
      </TooltipContent>
    </Tooltip>
  );
}
