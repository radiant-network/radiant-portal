import { PlusIcon } from 'lucide-react';
import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/base/ui/button';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { useConfig } from '@/components/model/applications-config';
import { MERGE_VALUES_STRATEGIES } from '@/components/model/sqon';

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

/**
 * Display Symbol of the gene whose consequence was prioritized by the picked as the value in the table.
 * Hyperlink on the gene with the gene_omim_id of the gene whose consequence was prioritized by the picked.:
 * https://www.omim.org/entry/<gene_omim_id>
 * + to add the symbol in a new Query bar where query pill: Gene Symbol = symbol
 */
function GeneCell({ className, symbol }: GeneCellProps) {
  const config = useConfig();
  const appId = config.variant_entity.app_id;

  if (!symbol) return <EmptyCell />;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <a href={getOmimOrgUrl({ symbol })} className="underline hover:no-underline" target="_blank">
        {symbol}
      </a>
      <Button
        size="xs"
        variant="ghost"
        iconOnly
        className="size-5"
        onClick={() => {
          queryBuilderRemote.updateActiveQueryField(appId, {
            field: `symbol`,
            value: [symbol],
            merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
          });
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

export default GeneCell;
