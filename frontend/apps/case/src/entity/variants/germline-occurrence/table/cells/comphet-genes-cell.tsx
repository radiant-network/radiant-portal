import { useCallback, useMemo } from 'react';

import { type ComphetGene, SqonOpEnum } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { QBActionType, useQBContext, useQBDispatch } from '@/components/base/query-builder/hooks/use-query-builder';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const COMPHET_OF_FIELD = 'comphet_of';
const SYMBOL_FIELD = 'symbol';

type ComphetGenesCellProps = {
  genes?: ComphetGene[];
  locusId: string;
  hgvsg?: string;
  locus?: string;
};

function ComphetGenesCell({ genes = [], locusId, hgvsg, locus }: ComphetGenesCellProps) {
  const { t } = useI18n();
  const { sqons } = useQBContext();
  const dispatch = useQBDispatch();

  const sortedGenes = useMemo(
    () => [...genes].sort((a, b) => b.nb - a.nb || a.symbol.localeCompare(b.symbol)),
    [genes],
  );

  const handleShowVariants = useCallback(
    (symbol: string) => {
      // ADD_QUERY is a no-op when an empty query already exists, so reuse it.
      const emptyQuery = sqons.find(sqon => sqon.content.length === 0);
      if (emptyQuery) {
        dispatch({ type: QBActionType.SET_ACTIVE_QUERY, payload: { id: emptyQuery.id } });
      } else {
        dispatch({ type: QBActionType.ADD_QUERY });
      }
      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: { content: { field: SYMBOL_FIELD, value: [symbol] }, op: SqonOpEnum.In },
      });
      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: {
          content: { field: COMPHET_OF_FIELD, value: [locusId], overrideValuesName: hgvsg || locus },
          op: SqonOpEnum.In,
        },
      });
    },
    [sqons, dispatch, locusId, hgvsg, locus],
  );

  if (sortedGenes.length === 0) return <EmptyCell />;

  return (
    <div className="flex flex-col">
      {sortedGenes.map(gene => (
        <span key={gene.symbol}>
          {gene.symbol} (
          <Button
            variant="link"
            size="xs"
            className="h-auto px-0"
            onClick={() => handleShowVariants(gene.symbol)}
            aria-label={t('a11y.comphet_genes_cell.filter_variants', { count: gene.nb, gene: gene.symbol })}
          >
            {gene.nb}
          </Button>
          )
        </span>
      ))}
    </div>
  );
}

export default ComphetGenesCell;
