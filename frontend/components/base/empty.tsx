import { ChartColumn, ChartLine, ChartPie, ChartScatter, LucideIcon } from 'lucide-react';
import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '../lib/utils';

const emptyVariants = tv({
  slots: {
    base: 'flex flex-col justify-center',
    iconsContainer: 'text-neutral',
    textContainer: '',
    title: 'text-center font-semibold',
    description: 'text-center text-muted-foreground font-normal',
    customIcon: 'flex items-center justify-center border rounded-md',
  },
  variants: {
    bordered: {
      true: {
        base: 'border border-dashed rounded-lg',
      },
    },
    size: {
      mini: {
        base: 'py-3 gap-3',
        iconsContainer: '[&_svg]:size-4',
        textContainer: 'space-y-1',
        title: 'text-base',
        description: 'text-xs',
        customIcon: 'size-8 [&_svg]:size-4',
      },
      default: {
        base: 'py-8 gap-3',
        iconsContainer: '[&_svg]:size-6',
        textContainer: 'space-y-2',
        title: 'text-lg',
        description: 'text-sm',
        customIcon: 'size-12',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type EmptyProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyVariants> & {
    showIcon?: boolean;
    title?: string;
    description?: string;
  } & (
    | {
        iconType: 'chartRow' | 'chartGrid';
        icon?: never;
      }
    | {
        iconType: 'custom';
        icon: LucideIcon;
      }
    | {
        showIcon: false;
        iconType?: never;
        icon?: never;
      }
  );

function Empty({
  title,
  description,
  showIcon = true,
  bordered = false,
  iconType,
  icon: Icon,
  size,
  className,
  ...props
}: EmptyProps) {
  const styles = emptyVariants({ size, bordered });

  return (
    <div className={styles.base({ className })} {...props}>
      {showIcon ? (
        iconType === 'chartRow' ? (
          <EmptyIconsRow className={styles.iconsContainer()} />
        ) : iconType === 'chartGrid' ? (
          <EmptyIconsGrid className={styles.iconsContainer()} />
        ) : iconType === 'custom' ? (
          <div className="flex justify-center">
            <div className={styles.customIcon()}>{<Icon />}</div>
          </div>
        ) : null
      ) : null}
      <div className={styles.textContainer()}>
        {title && <h1 className={styles.title()}>{title}</h1>}
        {description && <div className={styles.description()}>{description}</div>}
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
