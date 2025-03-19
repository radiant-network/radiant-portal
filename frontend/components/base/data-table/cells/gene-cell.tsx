import { PlusIcon } from 'lucide-react';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { cn } from '@/components/lib/utils';
import { IconButton } from '@/components/base/Buttons';

type GeneCellProps = {
  className?: string;
  symbol?: string;
};

type GetOmimOrgUrlProps = {
  omimGeneId?: string;
  symbol: string;
};

function getOmimOrgUrl({ omimGeneId, symbol }: GetOmimOrgUrlProps): string {
  if (omimGeneId) {
    return `https://www.omim.org/entry/${omimGeneId}`;
  }

  return `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${symbol}`;
}

function GeneCell({ className, symbol }: GeneCellProps) {
  if (!symbol) return <EmptyCell />;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <a href={getOmimOrgUrl({ symbol })} className="underline hover:no-underline" target="_blank">
        {symbol}
      </a>
      <IconButton
        size="sm"
        icon={PlusIcon}
        onClick={() => {
          console.log('addQuery to be added'); //TODO: to remove
        }}
      />
    </div>
  );
}

export default GeneCell;
