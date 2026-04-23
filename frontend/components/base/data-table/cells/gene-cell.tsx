import { useCallback } from 'react';
import { PlusIcon } from 'lucide-react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
import { BooleanOperators } from '@/components/cores/sqon';

import { QBActionType, useQBDispatch, useQBMultiselectValue } from '../../query-builder-v3/hooks/use-query-builder';

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
function GeneCell({ symbol }: GeneCellProps) {
  const dispatch = useQBDispatch();
  const defaultItems = useQBMultiselectValue('symbol') as string[];

  const handleClick = useCallback(() => {
    if (!symbol || defaultItems.includes(symbol)) return;

    dispatch({
      type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
      payload: {
        content: {
          field: 'symbol',
          value: [...defaultItems, symbol],
        },
        op: BooleanOperators.And,
      },
    });
  }, [symbol, dispatch, defaultItems]);

  if (!symbol) return <EmptyCell />;

  return (
    <div className="flex items-center gap-1">
      <AnchorLink size="sm" variant="primary" href={getOmimOrgUrl({ symbol })} target="_blank">
        {symbol}
      </AnchorLink>
      <Button size="xs" variant="ghost" iconOnly className="size-5 text-primary" onClick={handleClick}>
        <PlusIcon />
      </Button>
    </div>
  );
}

export default GeneCell;
