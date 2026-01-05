import { PlusIcon } from 'lucide-react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
import { useConfig } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { MERGE_VALUES_STRATEGIES } from '@/components/cores/sqon';
import { cn } from '@/components/lib/utils';

type GeneCellProps = {
  className?: string;
  symbol?: string;
};

/**
 * Display Symbol of the gene whose consequence was prioritized by the picked as the value in the table.
 * Hyperlink on the gene with the gene_omim_id of the gene whose consequence was prioritized by the picked.:
 * https://www.omim.org/entry/<gene_omim_id>
 * + to add the symbol in a new Query bar where query pill: Gene Symbol = symbol
 */
function GeneCell({ className, symbol }: GeneCellProps) {
  const config = useConfig();
  const appId = config.snv_occurrence.app_id;

  if (!symbol) return <EmptyCell />;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <AnchorLink size="sm" variant="primary" href={getOmimOrgUrl({ symbol })} target="_blank">
        {symbol}
      </AnchorLink>
      <Button
        size="xs"
        variant="ghost"
        iconOnly
        className="size-5 text-primary"
        onClick={() => {
          queryBuilderRemote.updateActiveQueryField(appId, {
            field: `symbol`,
            value: [symbol],
            merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
          });
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

export default GeneCell;
