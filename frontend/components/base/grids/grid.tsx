import { Responsive, useContainerWidth, ResponsiveLayouts, Layout } from 'react-grid-layout';
import GridCard, { CardLayoutItem } from './grid-card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridOptionsMenuSettings from './grid-options-menu-settings';
import { userPreferenceApi } from '@/utils/api';
import { UserPreference } from '@/api/api';

import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import GridSkeleton from './grid-skeleton';

export type GridCards = {
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[];

type OptionsMenuSettings = { visible: true; tooltipText: string } | { visible: false; tooltipText?: string };

type GridProps = {
  id: string;
  cards: GridCards;
  defaultLayouts: ResponsiveLayouts;
  optionsMenuSettings: OptionsMenuSettings;
  gridCardProps?: {
    closeText: string;
  };
};

type FetchUserPreferenceInput = {
  key: string;
};

type PostUserPreferenceInput = FetchUserPreferenceInput & {
  userPreference: UserPreference;
};

type UserPreferenceContent = {
  layouts: ResponsiveLayouts;
  defaultLayouts: ResponsiveLayouts;
  activeCards: string[];
};

/**
 * Get user preference
 */
async function fetchUserPreference(input: FetchUserPreferenceInput) {
  const response = await userPreferenceApi.getUserPreferences(input.key);
  return response.data;
}

/**
 * Post user preference
 */
async function postUserPreference(_url: string, { arg }: { arg: PostUserPreferenceInput }) {
  const response = await userPreferenceApi.postUserPreferences(arg.key, arg.userPreference);
  return response.data;
}

/**
 * A LayoutItem config can change the card behavior (static, isDraggable etc.)
 * It must be passed as a prop to card to reflect those changes.
 *
 * each props used default react-grid-layout values of response-grid
 * - isStatic: false
 * - isDraggable: true
 * - isResizable: true
 * - isBounded: false
 */
export function getLayoutPropsFromCard(layouts: ResponsiveLayouts, id: string): CardLayoutItem {
  const breakpoints = Object.keys(layouts) as Array<keyof ResponsiveLayouts>;

  const defaultProps = { id, isStatic: false, isDraggable: true, isResizable: true };

  for (const breakpoint of breakpoints) {
    const item = (layouts[breakpoint] ?? []).find(entry => entry.i === id);
    if (item) {
      return {
        id,
        isStatic: item.static ?? defaultProps.isStatic,
        isDraggable: item.isDraggable ?? defaultProps.isDraggable,
        isResizable: item.isResizable ?? defaultProps.isResizable,
      };
    }
  }

  console.warn(`grid: ${id} has not been found in layouts`);
  return defaultProps;
}

/**
 * Breakpoints should only contain active cards.
 */
export function getActiveLayouts(layouts: ResponsiveLayouts, activeCards: string[]): ResponsiveLayouts {
  const breakpoints = Object.keys(layouts) as Array<keyof ResponsiveLayouts>;
  const activeLayouts: ResponsiveLayouts = {};

  for (const breakpoint of breakpoints) {
    activeLayouts[breakpoint] = (layouts[breakpoint] ?? []).filter(item => activeCards.includes(item.i));
  }

  return activeLayouts;
}

/**
 * MergeLayouts is used to keep the previous config of an inactive card.
 * If it's not used, the card size and position will not behave as expected.
 */
export function mergeLayouts(prev: ResponsiveLayouts, allLayouts: ResponsiveLayouts): ResponsiveLayouts {
  const mergedLayouts: ResponsiveLayouts = {};
  const breakpoints = Object.keys(allLayouts) as Array<keyof ResponsiveLayouts>;

  for (const breakpoint of breakpoints) {
    const layout = allLayouts[breakpoint] ?? [];
    const layoutIds = layout.map(card => card.i);
    const result = (prev[breakpoint] ?? []).filter(card => !layoutIds.includes(card.i));
    mergedLayouts[breakpoint] = [...layout, ...result];
  }

  return mergedLayouts;
}

/**
 * Compare remote/locale defaultLayouts for deprecated values
 */
export function isRemoteDefaultLayoutsDeprecated(
  remoteDefaultLayouts: ResponsiveLayouts,
  localDefaultLayouts: ResponsiveLayouts,
): boolean {
  const breakpoints = Object.keys(localDefaultLayouts) as Array<keyof ResponsiveLayouts>;

  for (const breakpoint of breakpoints) {
    const localLayout = localDefaultLayouts[breakpoint] ?? [];
    const remoteLayout = remoteDefaultLayouts[breakpoint] ?? [];

    if (localLayout.length !== remoteLayout.length) {
      return true;
    }

    for (const localItem of localLayout) {
      const remoteItem = remoteLayout.find(item => item.i === localItem.i);
      if (!remoteItem) {
        return true;
      }

      const samePosition = remoteItem.x === localItem.x && remoteItem.y === localItem.y;
      const sameSize = remoteItem.w === localItem.w && remoteItem.h === localItem.h;
      if (!samePosition || !sameSize) {
        return true;
      }
    }
  }

  return false;
}

/**
 * react-grid-layout enriches items with extra props (moved, static, etc.)
 * We only compare layouts by position (x, y), size (w, h) and presence in config.
 */
function isPristine(
  currentLayouts: ResponsiveLayouts,
  defaultLayouts: ResponsiveLayouts,
  activeCards: string[],
): boolean {
  const breakpoints = Object.keys(defaultLayouts) as Array<keyof ResponsiveLayouts>;

  for (const breakpoint of breakpoints) {
    const defaultLayout = defaultLayouts[breakpoint] ?? [];
    const layout = currentLayouts[breakpoint] ?? [];

    if (defaultLayout.length !== layout.length) {
      return false;
    }

    if (layout.length !== activeCards.length) {
      return false;
    }

    for (const defaultItem of defaultLayout) {
      const currentItem = layout.find(item => item.i === defaultItem.i);
      if (!currentItem) {
        return false;
      }

      const samePosition = currentItem.x === defaultItem.x && currentItem.y === defaultItem.y;
      const sameSize = currentItem.w === defaultItem.w && currentItem.h === defaultItem.h;
      if (!samePosition || !sameSize) {
        return false;
      }
    }
  }

  return true;
}

/**
 * React-grid-layout default values
 * Breakpoints
 *  lg: 12 cols
 *  md: 10 cols
 *  sm: 6 cols
 *  xs: 4 cols
 *  xxs: 2 cols
 *
 * Layout
 *  i: string; Unique identifier (must match child key)
 *  x: number; X position in grid units
 *  y: number; Y position in grid units
 *  w: number; Width in grid units
 *  h: number; Height in grid units
 *  minW?: number; Minimum width (default: 0)
 *  maxW?: number; Maximum width (default: Infinity)
 *  minH?: number; Minimum height (default: 0)
 *  maxH?: number; Maximum height (default: Infinity)
 *  static?: boolean; If true, not draggable or resizable
 *  isDraggable?: boolean; Override grid isDraggable
 *  isResizable?: boolean; Override grid isResizable
 *  isBounded?: boolean; Override grid isBounded
 *
 */
function Grid({ id, defaultLayouts, optionsMenuSettings, cards, gridCardProps }: GridProps) {
  const preferenceKey = useMemo(() => `resizable-grid-${id}`, [id]);
  const defaultActiveCards = useMemo(() => cards.map(card => card.id), [cards]);
  const { width, containerRef, mounted } = useContainerWidth();
  const [activeCards, setActiveCards] = useState<string[]>(defaultActiveCards);
  const [layouts, setLayouts] = useState<ResponsiveLayouts>(defaultLayouts);
  const [isReady, setIsReady] = useState(false);
  const preferences = useSWRImmutable(preferenceKey, () => fetchUserPreference({ key: preferenceKey }), {
    shouldRetryOnError: false,
  });
  const { trigger } = useSWRMutation(preferenceKey, postUserPreference, {
    revalidate: false,
    populateCache: false,
  });

  const handleLayoutChange = useCallback((_currentLayout: Layout, allLayouts: ResponsiveLayouts) => {
    setLayouts(prev => mergeLayouts(prev, allLayouts));
  }, []);

  const handleReset = useCallback(() => {
    setLayouts(defaultLayouts);
    setActiveCards(defaultActiveCards);
  }, [defaultLayouts, defaultActiveCards]);

  const handleClose = useCallback((id: string) => {
    setActiveCards(prev => prev.filter(cardId => cardId !== id));
  }, []);

  const handleCheckedChange = useCallback((id: string, checked: boolean) => {
    setActiveCards(prev => (checked ? [...prev, id] : prev.filter(cardId => cardId !== id)));
  }, []);

  /**
   * Loading user-preference.
   * Use defaultLayouts if user-preference has never been set or if the request failed.
   * If defaultLayouts changes (new card, new layout etc.), the local layout will be used instead
   * of the remote one.
   */
  useEffect(() => {
    if (isReady || preferences.isLoading) return;
    const content = preferences.data?.content as UserPreferenceContent | undefined;
    const hasDeprecatedLayouts =
      content?.defaultLayouts && isRemoteDefaultLayoutsDeprecated(content.defaultLayouts, defaultLayouts);

    if (!hasDeprecatedLayouts) {
      if (content?.layouts) {
        setLayouts(content.layouts);
      }
      if (content?.activeCards) {
        setActiveCards(content.activeCards);
      }
    }
    setIsReady(true);
  }, [isReady, preferences.isLoading, preferences.data, activeCards]);

  /**
   * Save layouts to user-preference api
   */
  useEffect(() => {
    if (!isReady) return;
    const handler = setTimeout(() => {
      const content: UserPreferenceContent = { layouts, defaultLayouts, activeCards };
      trigger({
        key: preferenceKey,
        userPreference: {
          key: preferenceKey,
          content,
        },
      });
    }, 350);

    return () => {
      if (handler) clearTimeout(handler);
    };
  }, [layouts, activeCards, isReady]);

  return (
    <div ref={containerRef} className="w-full">
      {!isReady || preferences.isLoading ? (
        <GridSkeleton
          defaultLayouts={defaultLayouts}
          cards={cards}
          hasMenuOptionsSettings={optionsMenuSettings.visible}
        />
      ) : (
        mounted && (
          <div>
            {optionsMenuSettings.visible && (
              <div className="flex justify-end">
                <GridOptionsMenuSettings
                  cards={cards}
                  activeCards={activeCards}
                  isPristine={isPristine(layouts, defaultLayouts, activeCards)}
                  onCheckedChange={handleCheckedChange}
                  onReset={handleReset}
                  tooltipText={optionsMenuSettings.tooltipText}
                />
              </div>
            )}
            <Responsive
              layouts={getActiveLayouts(layouts, activeCards)}
              width={width}
              onLayoutChange={handleLayoutChange}
            >
              {cards
                .filter(card => activeCards.includes(card.id))
                .map(card => {
                  const layoutItemProps = getLayoutPropsFromCard(layouts, card.id);
                  return (
                    <GridCard
                      key={card.id}
                      id={layoutItemProps.id}
                      content={card.content}
                      title={card.title}
                      onClose={handleClose}
                      closeText={gridCardProps?.closeText}
                      isStatic={layoutItemProps.isStatic}
                      isDraggable={layoutItemProps.isDraggable}
                      isResizable={layoutItemProps.isResizable}
                    />
                  );
                })}
            </Responsive>
          </div>
        )
      )}
    </div>
  );
}
export default Grid;
