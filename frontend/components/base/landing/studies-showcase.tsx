import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from '../shadcn/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../shadcn/carousel';
import StatItem, { StatItemLayout } from '../stat-item/stat-item';

export enum StudiesAccent {
  Panel = 'panel',
  Carousel = 'carousel',
}

export enum StudiesArrows {
  Below = 'below',
  Sides = 'sides',
}

export enum StudiesStackOrder {
  CarouselFirst = 'carousel-first',
  PanelFirst = 'panel-first',
}

type StudiesShowcaseProps<T> = {
  accent?: StudiesAccent;
  arrows?: StudiesArrows;
  stackOrder?: StudiesStackOrder;
  statLayout?: StatItemLayout;
  carouselClassName?: string;
  icon: ReactNode;
  count: ReactNode;
  label: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  items: T[];
  getItemKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

/** Side panel (count + description + CTA) next to a carousel of study slides. */
function StudiesShowcase<T>({
  accent = StudiesAccent.Panel,
  arrows = StudiesArrows.Below,
  stackOrder = StudiesStackOrder.CarouselFirst,
  statLayout = StatItemLayout.Stacked,
  carouselClassName,
  icon,
  count,
  label,
  description,
  ctaLabel,
  ctaHref = '#',
  items,
  getItemKey,
  renderItem,
}: StudiesShowcaseProps<T>) {
  const panelIsAccent = accent === StudiesAccent.Panel;
  const panelFirst = stackOrder === StudiesStackOrder.PanelFirst;

  return (
    <div className="grid overflow-hidden rounded-xl border lg:grid-cols-[1fr_2fr]">
      <div
        className={cn(
          'flex flex-col gap-6 p-8',
          panelFirst ? 'order-1' : 'order-2 lg:order-1',
          panelIsAccent ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        <StatItem
          icon={icon}
          value={count}
          label={label}
          layout={statLayout}
          iconClassName={panelIsAccent ? 'text-primary-foreground' : undefined}
          labelClassName={panelIsAccent ? 'text-primary-foreground/90' : undefined}
        />
        <p className={cn('text-sm', panelIsAccent ? 'text-primary-foreground/90' : 'text-muted-foreground')}>
          {description}
        </p>
        <Button asChild variant={panelIsAccent ? 'secondary' : 'default'} className="self-start">
          <a href={ctaHref}>
            {ctaLabel} <ArrowRight />
          </a>
        </Button>
      </div>

      <div
        className={cn(
          'min-w-0 p-8',
          panelFirst ? 'order-2' : 'order-1 lg:order-2',
          panelIsAccent ? 'bg-background' : 'bg-primary text-primary-foreground',
          carouselClassName,
        )}
      >
        <Carousel opts={{ align: 'start' }} className={cn('w-full', arrows === StudiesArrows.Sides && 'px-20')}>
          <CarouselContent>
            {items.map(item => (
              <CarouselItem key={getItemKey(item)}>{renderItem(item)}</CarouselItem>
            ))}
          </CarouselContent>
          {arrows === StudiesArrows.Sides ? (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          ) : (
            <div className="mt-6 flex justify-center gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default StudiesShowcase;
