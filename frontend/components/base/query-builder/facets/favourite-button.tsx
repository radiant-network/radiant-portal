import { useState } from 'react';
import { Star, StarOff } from 'lucide-react';

import { useFacetFavourites } from '@/components/base/query-builder/facets/hooks/use-facet-favourites';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type FavouriteButtonProps = {
  facetKey: string;
  label: string;
};

/**
 * Star toggle shown in a facet header. Hidden until the header (group/facet-header) is hovered,
 * unless the facet is already a favourite or the button has keyboard focus.
 */
export function FavouriteButton({ facetKey, label }: FavouriteButtonProps) {
  const { t } = useI18n();
  const favourites = useFacetFavourites();
  // Holds the resting look after a click, so the hover preview doesn't show the opposite action under the pointer
  const [isSettling, setIsSettling] = useState(false);

  if (!favourites) return null;

  const isFavourite = favourites.isFavourite(facetKey);
  const showHover = !isSettling;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="2xs"
          iconOnly
          aria-pressed={isFavourite}
          aria-label={
            isFavourite
              ? t('a11y.facet_favourite.remove', { facet: label })
              : t('a11y.facet_favourite.add', { facet: label })
          }
          data-cy={`facet-favourite-${facetKey}`}
          onClick={() => {
            setIsSettling(true);
            favourites.toggleFavourite(facetKey);
          }}
          onPointerLeave={() => setIsSettling(false)}
          onBlur={() => setIsSettling(false)}
          className={cn(
            'group/favourite text-foreground hover:bg-transparent hover:text-foreground [&_svg]:size-3.5',
            !isFavourite && 'opacity-0 group-hover/facet-header:opacity-100 focus-visible:opacity-100',
          )}
        >
          {isFavourite ? (
            <>
              <Star
                className={cn(
                  'fill-current',
                  showHover && 'group-hover/favourite:hidden group-focus-visible/favourite:hidden',
                )}
              />
              <StarOff
                className={cn('hidden', showHover && 'group-hover/favourite:block group-focus-visible/favourite:block')}
              />
            </>
          ) : (
            <Star
              className={cn(
                'opacity-50',
                showHover &&
                  'group-hover/favourite:fill-current group-hover/favourite:text-accent-foreground group-focus-visible/favourite:fill-current group-focus-visible/favourite:text-accent-foreground',
              )}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFavourite ? t('query_filters.favourites.tooltip.remove') : t('query_filters.favourites.tooltip.add')}
      </TooltipContent>
    </Tooltip>
  );
}
