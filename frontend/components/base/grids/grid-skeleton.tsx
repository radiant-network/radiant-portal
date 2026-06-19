import { useMemo } from 'react';
import { Responsive, useContainerWidth, ResponsiveLayouts } from 'react-grid-layout';
import { Skeleton } from '../shadcn/skeleton';
import GridCard from './grid-card';
import { GridCards } from './grid';

type GridSkeletonProps = {
  cards: GridCards;
  defaultLayouts: ResponsiveLayouts;
  hasMenuOptionsSettings: boolean;
};

/**
 * In loading state, disable drag and resize by forcing static to every card.
 */
function GridSkeleton({ defaultLayouts, cards, hasMenuOptionsSettings }: GridSkeletonProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const skeletonLayouts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(defaultLayouts).map(([breakpoint, items]) => [
          breakpoint,
          (items ?? []).map(item => ({ ...item, static: true })),
        ]),
      ) as ResponsiveLayouts,

    [defaultLayouts],
  );

  return (
    <div ref={containerRef} className="w-full">
      {mounted && (
        <div>
          {hasMenuOptionsSettings && (
            <div className="flex justify-end">
              <Skeleton className="h-8 w-8" />
            </div>
          )}
          <Responsive layouts={skeletonLayouts} width={width}>
            {cards.map(card => (
              <GridCard
                key={card.id}
                id={card.id}
                title={<Skeleton className="h-4 w-32" />}
                content={<Skeleton className="h-full w-full" />}
                onClose={() => {}}
                isStatic={true}
                isResizable={false}
                isDraggable={false}
              />
            ))}
          </Responsive>
        </div>
      )}
    </div>
  );
}
export default GridSkeleton;
