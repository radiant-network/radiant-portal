import { Star, StarOff } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type FavoriteFacetButtonProps = {
  facetLabel: string;
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  dataCy?: string;
};

function FavoriteFacetButton({ facetLabel, isFavorite, onToggle, className, dataCy }: FavoriteFacetButtonProps) {
  const { t } = useI18n();

  const tooltip = isFavorite
    ? t('query_filters.favorites.star.tooltip_remove')
    : t('query_filters.favorites.star.tooltip_add');
  const ariaLabel = isFavorite
    ? t('query_filters.favorites.star.a11y_remove', { facet: facetLabel })
    : t('query_filters.favorites.star.a11y_add', { facet: facetLabel });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          aria-label={ariaLabel}
          aria-pressed={isFavorite}
          data-cy={dataCy}
          className={cn(
            'group/fav-btn inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            className,
          )}
        >
          {isFavorite ? (
            <>
              <Star className="size-3 fill-foreground text-foreground opacity-80 group-hover/fav-btn:hidden group-focus-visible/fav-btn:hidden" />
              <StarOff className="hidden size-3 text-foreground opacity-80 group-hover/fav-btn:block group-focus-visible/fav-btn:block" />
            </>
          ) : (
            <Star className="size-3 text-foreground opacity-50 group-hover/fav-btn:fill-foreground group-focus-visible/fav-btn:fill-foreground" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default FavoriteFacetButton;
