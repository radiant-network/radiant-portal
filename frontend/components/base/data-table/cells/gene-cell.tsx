import { PlusIcon } from 'lucide-react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/ui/button';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { cn } from '@/components/lib/utils';
import { useConfig } from '@/components/model/applications-config';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { MERGE_VALUES_STRATEGIES } from '@/components/model/sqon';

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
      <AnchorLink size="sm" variant="secondary" href={getOmimOrgUrl({ symbol })} target="_blank">
        {symbol}
      </AnchorLink>
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
