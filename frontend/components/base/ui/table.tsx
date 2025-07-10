import * as React from 'react';

import { cn } from '@/lib/utils';
import { tv, VariantProps } from 'tailwind-variants';

const tableVariants = tv({
  slots: {
    base: 'rounded-sm w-full border-separate border-spacing-0 caption-bottom table-fixed [&>tbody>tr>td]:px-2 [&>thead>tr>th]:px-2 [&>thead>tr>th]:h-10 [&>tfoot>tr>td]:px-2 [&>tfoot>tr>td]:h-10',
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

function Table({ containerRef, className, size, ...props }: TableProps) {
  const styles = tableVariants({ size });

  return (
    <div ref={containerRef} className="rounded-md relative w-full border overflow-auto max-h-[calc(100vh-120px)]">
      <table className={styles.base({ className })} {...props} />
    </div>
  );
}
Table.displayName = 'Table';

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}
TableHeader.displayName = 'TableHeader';

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&>tr:last-child>td]:border-b-0', className)} {...props} />;
}
TableBody.displayName = 'TableBody';

function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn('[&_td]:border-t bg-muted/50 font-medium', className)} {...props} />;
}
TableFooter.displayName = 'TableFooter';

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'group transition-colors data-[state=selected]:bg-muted [&>td]:border-b [&>th]:border-b hover:[&:has(td)]:[&>td]:bg-table-accent',
        className,
      )}
      {...props}
    />
  );
}
TableRow.displayName = 'TableRow';

function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'relative text-left align-middle font-medium text-muted-foreground hover:bg-table-accent',
        className,
      )}
      {...props}
    />
  );
}
TableHead.displayName = 'TableHead';

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('align-middle [&>div]:overflow-hidden [&>div]:text-ellipsis [&>div]:whitespace-nowrap', className)}
      {...props}
    />
  );
}
TableCell.displayName = 'TableCell';

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />;
}
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
