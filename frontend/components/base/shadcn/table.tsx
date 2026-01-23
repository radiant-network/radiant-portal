import * as React from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

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
    containerClassName?: string;
  };

function Table({ containerRef, className, containerClassName, size, ...props }: TableProps) {
  const styles = tableVariants({ size });

  return (
    <div ref={containerRef} className={cn('rounded-md relative w-full border overflow-auto', containerClassName)}>
      <table className={styles.base({ className })} {...props} />
    </div>
  );
}
Table.displayName = 'Table';

/**
 * TableHeader
 */
const tableHeaderVariants = tv({
  slots: {
    base: '[&>tr:last-child>td]:border-b-0',
  },
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TableHeaderType = React.HTMLAttributes<HTMLTableSectionElement> & VariantProps<typeof tableHeaderVariants>;
function TableHeader({ className, variant, ...props }: TableHeaderType) {
  const styles = tableHeaderVariants({ variant });
  return <thead className={styles.base({ className })} {...props} />;
}
TableHeader.displayName = 'TableHeader';

/**
 * TableBody
 */
function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&>tr:last-child>td]:border-b-0', className)} {...props} />;
}
TableBody.displayName = 'TableBody';

/**
 * TableFooter
 */
function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        '[&_th]:border-t [&>tr:last-child>th]:border-b-0 [&>tr>th]:bg-table-accent [&>tr>th]:p-2 [&>tr>th]:font-normal [&>tr>th]:text-foreground',
        className,
      )}
      {...props}
    />
  );
}
TableFooter.displayName = 'TableFooter';

/**
 * TableRow
 */
const tableRowVariants = tv({
  slots: {
    base: '',
  },
  variants: {
    variant: {
      default:
        'group transition-colors data-[state=selected]:bg-muted [&>td]:border-b [&>th]:border-b hover:bg-table-accent',
      border:
        'group transition-colors data-[state=selected]:bg-muted [&>td:last-child]:border-r-0 [&>th:last-child]:border-r-0 [&>td]:border-r [&>th]:border-r [&>td]:border-b [&>th]:border-b hover:bg-table-accent',
      borderless: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TableRowType = React.HTMLAttributes<HTMLTableRowElement> & VariantProps<typeof tableRowVariants>;

function TableRow({ className, variant = 'default', ...props }: TableRowType) {
  const styles = tableRowVariants({ variant });
  return <tr className={styles.base({ className })} {...props} />;
}
TableRow.displayName = 'TableRow';

const tableHeadVariants = tv({
  slots: {
    base: 'relative text-left align-middle font-medium text-foreground bg-table-header',
  },
  variants: {
    variant: {
      default: 'border-r [&>td:last-child]:border-r-0',
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TableHeadType = React.ThHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof tableHeadVariants>;
function TableHead({ className, variant, ...props }: TableHeadType) {
  const styles = tableHeadVariants({ variant });
  return <th className={styles.base({ className })} {...props} />;
}
TableHead.displayName = 'TableHead';

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'align-middle [&>div]:overflow-hidden [&>div]:text-ellipsis [&>div]:whitespace-nowrap group-hover:bg-table-accent',
        className,
      )}
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
