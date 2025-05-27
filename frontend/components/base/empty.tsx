import { ChartColumn, ChartLine, ChartPie, ChartScatter } from 'lucide-react';
import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '../lib/utils';

const emptyVariants = tv({
  slots: {
    base: 'flex flex-col',
    iconsContainer: 'text-slate',
    title: 'text-center text-muted-foreground font-medium',
    description: 'text-center text-muted-foreground',
  },
  variants: {
    size: {
      mini: {
        base: 'py-10 gap-3',
        iconsContainer: '[&_svg]:size-4',
        title: 'text-base',
        description: 'text-sm',
      },
      default: {
        base: 'py-12 gap-4',
        iconsContainer: '[&_svg]:size-6',
        title: 'text-xl',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyVariants> {
  iconsType?: 'row' | 'grid';
  showIcons?: boolean;
  title?: string;
  description: string;
}

function Empty({ title, description, showIcons = true, iconsType = 'row', size }: EmptyProps) {
  const styles = emptyVariants({ size });

  return (
    <div className={styles.base()}>
      {showIcons ? (
        iconsType === 'row' ? (
          <EmptyIconsRow className={styles.iconsContainer()} />
        ) : (
          <EmptyIconsGrid className={styles.iconsContainer()} />
        )
      ) : null}
      <div>
        {title && <h1 className={styles.title()}>{title}</h1>}
        <div className={styles.description()}>{description}</div>
      </div>
    </div>
  );
}

function EmptyIconsRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex gap-1 justify-center items-center', className)} {...props}>
      <ChartColumn />
      <ChartPie />
      <ChartLine />
      <ChartScatter />
    </div>
  );
}

function EmptyIconsGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1 justify-center items-center', className)} {...props}>
      <div className="flex gap-0.5 ml-3">
        <ChartPie className="mb-2" />
        <ChartScatter className="mt-2" />
      </div>
      <div className="flex gap-0.5 mr-3 -mt-4">
        <ChartColumn className="mb-2" />
        <ChartLine className="mt-2" />
      </div>
    </div>
  );
}

export default Empty;
