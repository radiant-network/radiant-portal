import * as React from 'react';
import { ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/base/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { useI18n } from '@/components/hooks/i18n';

const defaultPaginationStyle = 'gap-1 py-2 px-2.5 h-7 text-xs';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}
PaginationContent.displayName = 'PaginationContent';

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('', className)} {...props} />;
}
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & ButtonProps;

const PaginationLink = ({ className, isActive, size = 'sm', variant = 'outline', ...props }: PaginationLinkProps) => {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      className={className}
      size={size}
      variant={variant}
      {...props}
    />
  );
};
PaginationLink.displayName = 'PaginationLink';

const PaginationFirst = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useI18n();
  return (
    <PaginationLink
      aria-label={t('common.pagination.aria.first')}
      className={cn(defaultPaginationStyle, 'border-none shadow-none', className)}
      {...props}
    >
      <ChevronsLeft className="h-4 w-4" />
      <span>{t('common.pagination.first')}</span>
    </PaginationLink>
  );
};
PaginationFirst.displayName = 'PaginationFirst';

const PaginationLast = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useI18n();
  return (
    <PaginationLink
      aria-label={t('common.pagination.aria.last')}
      className={cn(defaultPaginationStyle, 'border-none shadow-none', className)}
      {...props}
    >
      <ChevronsRight className="h-4 w-4" />
      <span>{t('common.pagination.last')}</span>
    </PaginationLink>
  );
};
PaginationLast.displayName = 'PaginationLast';


const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useI18n();
  return (
    <PaginationLink
      aria-label={t('common.pagination.aria.previous')}
      className={cn(defaultPaginationStyle, className)}
      {...props}
    >
      <span>{t('common.pagination.previous')}</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useI18n();
  return (
    <PaginationLink aria-label={t('common.pagination.aria.next')} className={cn(defaultPaginationStyle, className)} {...props}>
      <span>{t('common.pagination.next')}</span>
    </PaginationLink>
  );
};
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  const { t } = useI18n();
  return (
    <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t('common.pagination.aria.more')}</span>
    </span>
  );
};
PaginationEllipsis.displayName = 'PaginationEllipsis';

type PaginationPageSizeProps = {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

const PaginationPageSize = ({ 
  pageSize, 
  onPageSizeChange, 
  pageSizeOptions = [10, 20, 30, 40, 50],
  className 
}: PaginationPageSizeProps) => {
  return (
    <Select
      value={String(pageSize)}
      onValueChange={value => {
        onPageSizeChange(Number(value));
      }}
    >
      <SelectTrigger className={cn(defaultPaginationStyle, "min-w-[125px]", className)}>
        <SelectValue>{pageSize} / page</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {pageSizeOptions.map(size => (
          <SelectItem key={`page-size-${size}`} value={String(size)} className="text-xs">
            {size} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
PaginationPageSize.displayName = 'PaginationPageSize';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
  PaginationPageSize,
  defaultPaginationStyle,
};
