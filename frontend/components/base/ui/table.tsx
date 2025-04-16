import * as React from 'react';

import { cn } from '@/lib/utils';
import { tv, VariantProps } from 'tailwind-variants';

const tableVariants = tv({
  slots: {
    base: 'rounded w-full border-separate border-spacing-0 caption-bottom table-fixed [&>tbody>tr>td]:px-2 [&>thead>tr>th]:px-2 [&>thead>tr>th]:h-10 [&>tfoot>tr>td]:px-2 [&>tfoot>tr>td]:h-10',
  },
  variants: {
    size: {
      default: {
        base: 'text-sm [&>tbody>tr>td]:py-2',
      },
      md: {
        base: 'text-base [&>tbody>tr>td]:py-4',
      },
      lg: {
        base: 'text-lg [&>tbody>tr>td]:py-6',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type TableProps = React.HTMLAttributes<HTMLTableElement> &
  VariantProps<typeof tableVariants> & {
    containerRef?: React.RefObject<HTMLDivElement>;
  };

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ containerRef, className, size, ...props }, ref) => {
  const styles = tableVariants({ size });

  return (
    <div ref={containerRef} className="rounded relative w-full border overflow-auto">
      <table ref={ref} className={styles.base({ className })} {...props} />
    </div>
  );
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={className} {...props} />,
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={className} {...props} />,
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('[&_td]:border-t bg-muted/50 font-medium', className)} {...props} />
  ),
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&>td]:border-b [&>th]:border-b [&>td]:last:border-b-0',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('relative text-left align-middle font-medium text-muted-foreground', className)}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn('align-middle', className)} {...props} />,
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  ),
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
