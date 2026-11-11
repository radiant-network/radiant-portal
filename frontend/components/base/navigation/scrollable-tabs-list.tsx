import { type ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { TabsList, tabsVariants, useTabsContext } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

const FADE_WIDTH = '24px';

// Keeps a tab strip on one line: chevrons page through the overflow, the native bar is hidden.
// The pill is drawn by the wrapper so the chevrons can sit inside it visually while staying out of
// the tablist, which ARIA allows to own nothing but tabs.
function ScrollableTabsList({ className, children, ...props }: ComponentProps<typeof TabsList>) {
  const { t } = useI18n();
  const { variant } = useTabsContext();
  const viewport = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const sync = useCallback(() => {
    const el = viewport.current;
    const row = el?.firstElementChild;
    if (!el || !row) return;

    const viewportWidth = el.getBoundingClientRect().width;
    const rowWidth = row.getBoundingClientRect().width;
    const overflowing = rowWidth > viewportWidth + 1;

    setOverflows(overflowing);
    setCanScrollPrev(overflowing && el.scrollLeft > 0);
    setCanScrollNext(overflowing && el.scrollLeft + viewportWidth < rowWidth - 1);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    // Observing fires the callback immediately, which covers the measure on mount.
    const observer = new ResizeObserver(sync);
    observer.observe(el);

    return () => observer.disconnect();
  }, [sync]);

  const page = (direction: 1 | -1) => {
    const el = viewport.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  // A style and not a Tailwind class: the stops are computed, and a class must be literal to exist.
  const maskImage = `linear-gradient(to right, ${[
    ...(canScrollPrev ? ['transparent 0', `black ${FADE_WIDTH}`] : ['black 0']),
    ...(canScrollNext ? [`black calc(100% - ${FADE_WIDTH})`, 'transparent 100%'] : ['black 100%']),
  ].join(', ')})`;

  return (
    <div className={cn(tabsVariants({ variant }).list(), 'flex w-full', className)}>
      {overflows && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          className="size-6 shrink-0"
          disabled={!canScrollPrev}
          onClick={() => page(-1)}
        >
          <ChevronLeft />
          <span className="sr-only">{t('a11y.tabs.previous')}</span>
        </Button>
      )}

      {/* Without min-w-0 the viewport grows to fit the whole row — a flex item will not shrink below
          its content — so nothing ever overflows and the chevrons never appear. */}
      <div
        ref={viewport}
        onScroll={sync}
        style={{ maskImage, WebkitMaskImage: maskImage }}
        className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <TabsList className="h-full w-max min-w-full bg-transparent p-0" {...props}>
          {children}
        </TabsList>
      </div>

      {overflows && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          className="size-6 shrink-0"
          disabled={!canScrollNext}
          onClick={() => page(1)}
        >
          <ChevronRight />
          <span className="sr-only">{t('a11y.tabs.next')}</span>
        </Button>
      )}
    </div>
  );
}

export default ScrollableTabsList;
