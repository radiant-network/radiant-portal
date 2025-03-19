import { cn } from '@/components/lib/utils';

type ExternalLinkCellProps = {
  className?: string;
  url: string;
  children?: any;
};

function LinkCell({ className, url, children }: ExternalLinkCellProps) {
  return (
    <a href={url} className={cn('overflow-hidden text-ellipsis underline hover:no-underline', className)}>
      {children}
    </a>
  );
}

export default LinkCell;
